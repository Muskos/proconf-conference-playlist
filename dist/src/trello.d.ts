import { Video } from "./youtube.js";
export declare const createTrelloList: (name: string) => Promise<string>;
export declare const createTrelloCards: (listId: string, videos: Video[]) => Promise<number>;
