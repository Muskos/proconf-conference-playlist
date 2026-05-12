export interface Video {
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
declare const getPlaylistUrl: (playlistId: string, key: string, maxResult: string, pageToken?: string) => string;
declare const getYoutubePlaylist: (playlistId: string) => Promise<{
    videos: Video[];
    stats: PlaylistStats;
}>;
export { getPlaylistUrl, getYoutubePlaylist };
