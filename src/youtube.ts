import config from "../config";
import { GET_YOUTUBE_PLAYLIST, GET_YOUTUBE_VIDEO } from "./urls";

interface Video {
  id: string;
  snippet: {
    title: string;
  };
}

export interface PlaylistStats {
  totalInPlaylist: number;
  totalFromApi: number;
  unavailable: number;
  unavailableIds: string[];
  filteredByDuration: number;
  cardsToCreate: number;
}

const MIN_DURATION = 300;

// Helper to parse ISO8601 duration to seconds
function parseISO8601Duration(duration: string): number {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = duration.match(regex);
  if (!matches) return 0;
  const hours = parseInt(matches[1] || "0", 10);
  const minutes = parseInt(matches[2] || "0", 10);
  const seconds = parseInt(matches[3] || "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

const getPlaylistUrl = (
  playlistId: string,
  key: string,
  maxResult: string,
  pageToken?: string
) =>
  `${GET_YOUTUBE_PLAYLIST}?part=contentDetails&playlistId=${playlistId}&key=${key}&maxResults=${maxResult}${
    pageToken ? `&pageToken=${pageToken}` : ""
  }`;

const getYoutubePlaylist = async (
  playlistId: string
): Promise<{ videos: Video[]; stats: PlaylistStats }> => {
  const videos: Video[] = [];
  const stats: PlaylistStats = {
    totalInPlaylist: 0,
    totalFromApi: 0,
    unavailable: 0,
    unavailableIds: [],
    filteredByDuration: 0,
    cardsToCreate: 0,
  };

  const getVideos = async (pageToken?: string) => {
    const url = getPlaylistUrl(
      playlistId,
      config.youtube.key,
      String(config.youtube.maxResult),
      pageToken
    );

    const response = await fetch(url).then((res) => res.json());
    const items = response.items || [];
    stats.totalInPlaylist += items.length;

    const ids = items
      .map((item: any) => item.contentDetails?.videoId)
      .filter(Boolean);
    if (ids.length === 0) {
      if (response.nextPageToken) await getVideos(response.nextPageToken);
      return;
    }

    const videoRes = await fetch(
      `${GET_YOUTUBE_VIDEO}?part=snippet,contentDetails&key=${config.youtube.key}&id=${ids.join(",")}`,
      { method: "get" }
    ).then((res: any) => res.json());

    const apiItems = videoRes.items || [];
    stats.totalFromApi += apiItems.length;

    const returnedIds = new Set(apiItems.map((i: any) => i.id));
    const missingIds = ids.filter((id) => !returnedIds.has(id));
    stats.unavailable += missingIds.length;
    stats.unavailableIds.push(...missingIds);

    const filtered = apiItems.filter((item: any) => {
      const duration = item.contentDetails?.duration;
      if (!duration) return false;
      return parseISO8601Duration(duration) > MIN_DURATION;
    });
    stats.filteredByDuration += apiItems.length - filtered.length;
    videos.push(...filtered);

    if (response.nextPageToken) {
      await getVideos(response.nextPageToken);
    }
  };

  await getVideos();
  stats.cardsToCreate = videos.length;

  return { videos, stats };
};

export { getPlaylistUrl, getYoutubePlaylist };
