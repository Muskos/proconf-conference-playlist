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
declare const config: Config;
export default config;
