import { getYoutubePlaylist, PlaylistStats } from "./youtube.js";
import { createTrelloCards, createTrelloList } from "./trello.js";

export interface CreateCardsOptions {
  playlistId: string;
  listName: string;
}

export interface CreateCardsResult {
  stats: PlaylistStats;
  listId: string;
  cardsCreated: number;
}

export async function createCardsFromPlaylist({
  playlistId,
  listName,
}: CreateCardsOptions): Promise<CreateCardsResult> {
  const { videos, stats } = await getYoutubePlaylist(playlistId);
  const listId = await createTrelloList(listName);
  const cardsCreated = await createTrelloCards(listId, videos);

  return {
    stats,
    listId,
    cardsCreated,
  };
}

export type { PlaylistStats };
