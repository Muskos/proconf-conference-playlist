import config from "../config";
import { GET_YOUTUBE_PLAYLIST, GET_YOUTUBE_VIDEO } from "./urls";

interface Video {
  id: string;
  snippet: {
    title: string;
  };
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
): Promise<Array<Video>> => {
  let videos = [];

  // TODO refactor this
  const getVideos = async (pageToken?: string) => {
    const url = getPlaylistUrl(
      playlistId,
      config.youtube.key,
      String(config.youtube.maxResult),
      pageToken
    );

    const response = await fetch(url).then((res) => res.json());
    const ids = response.items.map((item: any) => item.contentDetails.videoId);
    const URL = `${GET_YOUTUBE_VIDEO}?part=snippet&key=${
      config.youtube.key
    }&id=${ids.join(",")}`;
    await fetch(URL, { method: "get" })
      .then((res: any) => res.json())
      .then((res) => {
        videos = [...videos, ...res.items];
      });
    if (response.nextPageToken) {
      await getVideos(response.nextPageToken);
    }
  };

  await getVideos();

  return videos;
};

export { getPlaylistUrl, getYoutubePlaylist };
