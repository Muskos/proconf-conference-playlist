# Youtube playlist => Trello cards

Youtube playlist converter to trello cards.

## Usage

Run from this repository:

```sh
npm install
npm run build
npx . --playlist PLAYLIST_ID --list-name "Trello List Name"
```

After publishing the package, it can be called with:

```sh
npx proconf-conference-playlist --playlist PLAYLIST_ID --list-name "Trello List Name"
```

From GitHub, before publishing to npm:

```sh
npx github:Muskos/proconf-conference-playlist --playlist PLAYLIST_ID --list-name "Trello List Name"
```

The shorter binary name is available when the package is installed, or through `npm exec`:

```sh
npm exec --package proconf-conference-playlist proconf-playlist -- --playlist PLAYLIST_ID --list-name "Trello List Name"
```

## Commands

`npm run start -- --playlist PLAYLIST_ID --list-name "LIST_NAME"` - run script once with ts-node

`npm run build` - compile the package to `dist`

`npm run check` - type-check without emitting files

## Variables

Copy paste `.env.example` to `.env` and fill in.
Playlist id and list name can be passed on the command line via parameters.

Required variables:

```sh
YOUTUBE_KEY=
TRELLO_API_KEY=
TRELLO_TOKEN=
TRELLO_BOARD_ID=
```

Optional:

```sh
YOUTUBE_MAX_RESULT=50
```

## Library API

```ts
import { createCardsFromPlaylist } from "proconf-conference-playlist";

await createCardsFromPlaylist({
  playlistId: "PLAYLIST_ID",
  listName: "Trello List Name",
});
```
