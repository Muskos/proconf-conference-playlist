import { getYoutubePlaylist } from "./modules/youtube";
import { createTrelloCards } from "./modules/trello";

const videos = await getYoutubePlaylist();
createTrelloCards(videos);
