import nodeFetch from "node-fetch";

const fetch = nodeFetch as unknown as (
  url: string,
  init?: Record<string, unknown>
) => Promise<any>;

export default fetch;
