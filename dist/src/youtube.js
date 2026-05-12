import config from "../config.js";
import fetch from "./fetch.js";
import { GET_YOUTUBE_PLAYLIST, GET_YOUTUBE_VIDEO } from "./urls.js";
const MIN_DURATION = 300;
// Helper to parse ISO8601 duration to seconds
function parseISO8601Duration(duration) {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = duration.match(regex);
    if (!matches)
        return 0;
    const hours = parseInt(matches[1] || "0", 10);
    const minutes = parseInt(matches[2] || "0", 10);
    const seconds = parseInt(matches[3] || "0", 10);
    return hours * 3600 + minutes * 60 + seconds;
}
const getPlaylistUrl = (playlistId, key, maxResult, pageToken) => `${GET_YOUTUBE_PLAYLIST}?part=contentDetails&playlistId=${playlistId}&key=${key}&maxResults=${maxResult}${pageToken ? `&pageToken=${pageToken}` : ""}`;
const getYoutubePlaylist = async (playlistId) => {
    const videos = [];
    const stats = {
        totalInPlaylist: 0,
        totalFromApi: 0,
        unavailable: 0,
        unavailableIds: [],
        filteredByDuration: 0,
        cardsToCreate: 0,
    };
    const getVideos = async (pageToken) => {
        const url = getPlaylistUrl(playlistId, config.youtube.key, String(config.youtube.maxResult), pageToken);
        const response = await fetch(url).then((res) => res.json());
        const items = response.items || [];
        stats.totalInPlaylist += items.length;
        const ids = items
            .map((item) => { var _a; return (_a = item.contentDetails) === null || _a === void 0 ? void 0 : _a.videoId; })
            .filter(Boolean);
        if (ids.length === 0) {
            if (response.nextPageToken)
                await getVideos(response.nextPageToken);
            return;
        }
        const videoRes = await fetch(`${GET_YOUTUBE_VIDEO}?part=snippet,contentDetails&key=${config.youtube.key}&id=${ids.join(",")}`, { method: "get" }).then((res) => res.json());
        const apiItems = videoRes.items || [];
        stats.totalFromApi += apiItems.length;
        const returnedIds = new Set(apiItems.map((i) => i.id));
        const missingIds = ids.filter((id) => !returnedIds.has(id));
        stats.unavailable += missingIds.length;
        stats.unavailableIds.push(...missingIds);
        const filtered = apiItems.filter((item) => {
            var _a;
            const duration = (_a = item.contentDetails) === null || _a === void 0 ? void 0 : _a.duration;
            if (!duration)
                return false;
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
