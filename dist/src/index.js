import { getYoutubePlaylist } from "./youtube.js";
import { createTrelloCards, createTrelloList } from "./trello.js";
export async function createCardsFromPlaylist({ playlistId, listName, }) {
    const { videos, stats } = await getYoutubePlaylist(playlistId);
    const listId = await createTrelloList(listName);
    const cardsCreated = await createTrelloCards(listId, videos);
    return {
        stats,
        listId,
        cardsCreated,
    };
}
