import axios from "axios";

const client = axios.create({ baseURL: process.env.REACT_APP_SERVER_BASE });

export function getAlbums() {
  return client.get("/library/albums");
}

export function playPlayback() {
  return client.post("/player/play");
}

export function pausePlayback() {
  return client.post("/player/pause");
}

export async function getCurrentQueueState(): Promise<> {
  const response = await client.get("/player/queue");
  return response.data;
}
