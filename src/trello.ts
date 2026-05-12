import config from "../config.js";
import fetch from "./fetch.js";
import { CREATE_TRELLO_CARD, CREATE_TRELLO_LIST } from "./urls.js";
import { Video } from "./youtube.js";

const getCreateTrelloListUrl = (name: string) =>
  `${CREATE_TRELLO_LIST}?name=${encodeURIComponent(name)}&idBoard=${
    config.trello.boardId
  }&key=${config.trello.key}&token=${config.trello.token}`;

const getCreateTrelloCardUrl = (listId: string, title: string, videoId: string) =>
  `${CREATE_TRELLO_CARD}?idList=${listId}&key=${config.trello.key}&token=${
    config.trello.token
  }&name=${encodeURIComponent(title)}&desc=${encodeURIComponent(
    `https://youtu.be/${videoId}`
  )}`;

export const createTrelloList = async (name: string): Promise<string> => {
  const url = getCreateTrelloListUrl(name);
  const response = await fetch(url, {
    method: "POST",
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to create Trello list: ${response.status} ${errText}`);
  }

  const res: any = await response.json();
  return res.id;
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const createTrelloCards = async (
  listId: string,
  videos: Video[]
): Promise<number> => {
  let created = 0;
  for (const video of videos) {
    const res = await fetch(
      getCreateTrelloCardUrl(listId, video.snippet.title, video.id),
      { method: "POST" }
    );
    if (res.ok) {
      created++;
    } else {
      const errText = await res.text();
      console.error(
        `Failed: ${video.snippet.title} (${video.id}) - ${res.status}:`,
        errText.slice(0, 100)
      );
    }
    await delay(150);
  }
  return created;
};
