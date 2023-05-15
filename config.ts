import * as dotenv from "dotenv";

dotenv.config();

interface Config {
  youtube: {
    key: string;
    maxResult: number;
  };
  trello: {
    key: string;
    token: string;
    boardId: string;
  };
}

const config: Config = {
  youtube: {
    key: process.env.YOUTUBE_KEY || "",
    maxResult: Number(process.env.YOUTUBE_MAX_RESULT) || 50,
  },
  trello: {
    key: process.env.TRELLO_API_KEY || "",
    token: process.env.TRELLO_TOKEN || "",
    boardId: process.env.TRELLO_BOARD_ID || "",
  },
};

export default config;
