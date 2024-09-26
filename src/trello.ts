import fetch from "node-fetch";
import config from "../config";
import { CREATE_TRELLO_LIST } from "./urls";

const getCreateTrelloListUrl = (name: string) =>
  `${CREATE_TRELLO_LIST}?name=${name}&idBoard=${config.trello.boardId}&key=${config.trello.key}&token=${config.trello.token}`;

const getCreateTrelloCardUrl = (listId: string, title: string, videoId) =>
  `https://api.trello.com/1/cards?idList=${listId}&key=${config.trello.key}&token=${config.trello.token}&name=${title}&desc=https://youtu.be/${videoId}`;

export const createTrelloList = async (name: string) => {
  const url = getCreateTrelloListUrl(name);
  return fetch(url, {
    method: "POST",
  })
    .then((response) => response.json())
    .then((res) => res.id)
    .catch((err) => console.error(err));
};

export const createTrelloCards = async (listId: string, videos) => {
  const promises = [];
  for (const video of videos) {
    const url = getCreateTrelloCardUrl(listId, video.snippet.title, video.id);

    promises.push(
      fetch(url, { method: "POST" }).catch((err) => console.error(err))
    );
  }

  return Promise.all(promises);
};
