import { getYoutubePlaylist } from "./src/youtube";
import { createTrelloCards, createTrelloList } from "./src/trello";

function printReport(
  stats: {
    totalInPlaylist: number;
    totalFromApi: number;
    unavailable: number;
    unavailableIds: string[];
    filteredByDuration: number;
    cardsToCreate: number;
  },
  cardsCreated: number
) {
  console.log("\n" + "─".repeat(50));
  console.log("REPORT");
  console.log("─".repeat(50));
  console.log(`Total videos in playlist:     ${stats.totalInPlaylist}`);
  console.log(`Returned by YouTube API:      ${stats.totalFromApi}`);
  if (stats.unavailable > 0) {
    console.log(`Unavailable (private/deleted): ${stats.unavailable}`);
    console.log(`  IDs: ${stats.unavailableIds.join(", ")}`);
  }
  if (stats.filteredByDuration > 0) {
    console.log(`Filtered out (≤5 min):        ${stats.filteredByDuration}`);
  }
  console.log(`Cards to create:              ${stats.cardsToCreate}`);
  console.log(`Cards created:                ${cardsCreated}`);
  console.log("─".repeat(50) + "\n");
}

const playlistId = process.env.npm_config_playlist || "";
const listName = process.env.npm_config_listName || "New List";

if (playlistId && listName) {
  const { videos, stats } = await getYoutubePlaylist(playlistId);
  const listId = await createTrelloList(listName);
  const cardsCreated = await createTrelloCards(listId, videos);
  printReport(stats, cardsCreated);
} else {
  console.error("Please provide playlist id and list name");
}
