import { PlaylistStats } from "./youtube.js";
export interface CreateCardsOptions {
    playlistId: string;
    listName: string;
}
export interface CreateCardsResult {
    stats: PlaylistStats;
    listId: string;
    cardsCreated: number;
}
export declare function createCardsFromPlaylist({ playlistId, listName, }: CreateCardsOptions): Promise<CreateCardsResult>;
export type { PlaylistStats };
