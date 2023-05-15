import fetch from "node-fetch";
import config from "../config";

export const createTrelloCards = async (videos) => {
  fetch(
    `https://api.trello.com/1/lists?name=1222222&idBoard=${config.trello.boardId}&key=${config.trello.key}&token=${config.trello.token}`,
    {
      method: "POST",
    }
  )
    .then((response) => response.json())
    .then(async (text: any) => {
      const promises = [];
      videos.forEach((video) => {
        const CREATE_CARD_URL = `https://api.trello.com/1/cards?idList=${text.id}&key=${config.trello.key}&token=${config.trello.token}&name=${video.localizations.en.title}&desc=https://youtu.be/${video.id}`;

        promises.push(fetch(CREATE_CARD_URL, { method: "post" }));
      });

      Promise.all(promises);
    })
    .catch((err) => console.error(err));
};
