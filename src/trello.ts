import fetch from "node-fetch";
import config from "../config";
import { CREATE_TRELLO_LIST } from "./urls";

const getCreateTrelloListUrl = (name: string) =>
  `${CREATE_TRELLO_LIST}?name=${name}&idBoard=${config.trello.boardId}&key=${config.trello.key}&token=${config.trello.token}`;

const getCreateTrelloCardUrl = (listId: string, title: string, videoId: string) =>
  `https://api.trello.com/1/cards?idList=${listId}&key=${config.trello.key}&token=${config.trello.token}&name=${encodeURIComponent(title)}&desc=https://youtu.be/${videoId}`;

export const createTrelloList = async (name: string) => {
  const url = getCreateTrelloListUrl(name);
  return fetch(url, {
    method: "POST",
  })
    .then((response) => response.json())
    .then((res) => res.id)
    .catch((err) => console.error(err));
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const createTrelloCards = async (
  listId: string,
  videos: { id: string; snippet: { title: string } }[]
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
