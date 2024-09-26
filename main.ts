import { getYoutubePlaylist } from "./src/youtube";
import { createTrelloCards, createTrelloList } from "./src/trello";

const playlistId = process.env.npm_config_playlist || "";
const listName = process.env.npm_config_listName || "New List";

if (playlistId && listName) {
  const videos = await getYoutubePlaylist(playlistId);
  const listId = await createTrelloList(listName);
  await createTrelloCards(listId, videos);
} else {
  console.error("Please provide playlist id and list name");
}
