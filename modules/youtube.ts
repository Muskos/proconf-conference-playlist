import config from "../config";

const PLAYLIST_ID = "PL0lo9MOBetEEoraKI-ggy_CjUcH2tDlR7";

const getPlaylistUrl = (playlistId: string, key: string, maxResult: string) =>
  `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${playlistId}&key=${key}&maxResults=${maxResult}`;

const getYoutubePlaylist = async () => {
  const url = getPlaylistUrl(
    PLAYLIST_ID,
    config.youtube.key,
    String(config.youtube.maxResult) // TODO implement pagination
  );

  return fetch(url)
    .then((res) => res.json())
    .then(async (res) => {
      const ids = res.items.map((item: any) => item.contentDetails.videoId);
      const URL = `https://www.googleapis.com/youtube/v3/videos?part=localizations&key=${
        config.youtube.key
      }&id=${ids.join(",")}`;

      const videos = await fetch(URL, { method: "get" }).then((res: any) =>
        res.json()
      );

      return videos.items;
    });
};

export { getPlaylistUrl, getYoutubePlaylist };
