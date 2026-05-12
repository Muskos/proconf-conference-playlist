import { createCardsFromPlaylist } from "./index.js";
function readValue(args, names) {
    for (const name of names) {
        const exactIndex = args.indexOf(name);
        if (exactIndex >= 0) {
            return args[exactIndex + 1];
        }
        const prefixed = args.find((arg) => arg.startsWith(`${name}=`));
        if (prefixed) {
            return prefixed.slice(name.length + 1);
        }
    }
    return undefined;
}
function printHelp() {
    console.log(`
Usage:
  proconf-playlist --playlist <playlist-id> --list-name <trello-list-name>

Options:
  -p, --playlist, --playlist-id   YouTube playlist ID
  -l, --list-name                 Trello list name to create
  -h, --help                      Show help

Environment:
  YOUTUBE_KEY
  TRELLO_API_KEY
  TRELLO_TOKEN
  TRELLO_BOARD_ID
  YOUTUBE_MAX_RESULT              Optional, defaults to 50
`);
}
function parseArgs(args) {
    if (args.includes("--help") || args.includes("-h")) {
        printHelp();
        return null;
    }
    const playlistId = readValue(args, ["--playlist", "--playlist-id", "-p"]) ||
        process.env.npm_config_playlist ||
        "";
    const listName = readValue(args, ["--list-name", "--listName", "-l"]) ||
        process.env.npm_config_listName ||
        "New List";
    if (!playlistId) {
        throw new Error("Missing playlist ID. Pass --playlist <playlist-id>.");
    }
    if (!listName) {
        throw new Error("Missing Trello list name. Pass --list-name <name>.");
    }
    return { playlistId, listName };
}
function printReport(stats, cardsCreated) {
    console.log("\n" + "-".repeat(50));
    console.log("REPORT");
    console.log("-".repeat(50));
    console.log(`Total videos in playlist:      ${stats.totalInPlaylist}`);
    console.log(`Returned by YouTube API:       ${stats.totalFromApi}`);
    if (stats.unavailable > 0) {
        console.log(`Unavailable (private/deleted): ${stats.unavailable}`);
        console.log(`  IDs: ${stats.unavailableIds.join(", ")}`);
    }
    if (stats.filteredByDuration > 0) {
        console.log(`Filtered out (<=5 min):        ${stats.filteredByDuration}`);
    }
    console.log(`Cards to create:               ${stats.cardsToCreate}`);
    console.log(`Cards created:                 ${cardsCreated}`);
    console.log("-".repeat(50) + "\n");
}
export async function runCli(args = process.argv.slice(2)) {
    const options = parseArgs(args);
    if (!options)
        return;
    const { stats, cardsCreated } = await createCardsFromPlaylist(options);
    printReport(stats, cardsCreated);
}
