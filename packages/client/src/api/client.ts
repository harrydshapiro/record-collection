import axios from "axios";
import { API, RequestHandler } from "@songhaus/server";

const client = axios.create({ baseURL: process.env.REACT_APP_SERVER_BASE });

type ExtractResponseBody<T extends RequestHandler> = Exclude<
  Parameters<Parameters<T>[1]["send"]>[0],
  Error | undefined
>;

export async function getAlbums() {
  const response = await client.get("/library/albums");
  return response.data as ExtractResponseBody<API["library"]["albums"]["GET"]>;
}

export function playPlayback() {
  return client.post("/player/play");
}

export function pausePlayback() {
  return client.post("/player/pause");
}

export async function getCurrentQueueState() {
  const response = await client.get("/player/queue");
  return response.data as ExtractResponseBody<API["player"]["getQueue"]["GET"]>;
}
