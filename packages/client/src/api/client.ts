import axios from "axios";
import { API, RequestHandler } from "@record-collection/server";

export type Album = {
  /**
   * <albumArtistId1,albumArtistId2>#<albumName>
   */
  id: string;
  /**
   * List of ids of artists who own the entire album. Not just featured on a given song - like the Alison Kraus / Robert Plant album
   */
  albumArtistIds: string[];
  albumName: string;
  tracksIds: string[];
};

export type Artist = {
  id: string;
  artistName: string;
  /**
   * ID suffix increases serially
   * <artistName>#0
   */
};

export type Track = {
  /**
   * <trackName>#>albumId>#<artistId1,artistId2>
   */
  id: string;
  trackName: string;
  albumId: string;
  artistIds: string[];
  duration: number;
};

type MPCStateChanges = {
  player: {
    trackId: Track["id"];
    isPlaying: boolean;
    volume: number;
  };
  queue: Track["id"][];
};

// TODO: Make this generic so that we can type the currentState field
type OnMpcChangedCallback<MessagePayload> = (
  payload: MessagePayload,
) => void | Promise<void>;

const client = axios.create({ baseURL: process.env.REACT_APP_BACKEND_URL });

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

export function nextTrack() {
  console.log("GO TO NEXT TRACK");
}

export function previousTrack() {
  console.log("GO TO PERVIOUS TRACK");
}

export async function getCurrentQueueState() {
  const response = await client.get("/player/queue");
  return response.data as ExtractResponseBody<API["player"]["getQueue"]["GET"]>;
}

class SSEConnection<MessagePayload> {
  private url!: string;
  private eventSource!: EventSource;

  constructor(url: string) {
    this.url = url;
    this.eventSource = new EventSource(this.url);
    this.eventSource.addEventListener("open", () =>
      console.log("event source open", { url: this.url }),
    );
    this.eventSource.addEventListener("error", () =>
      console.error("event source error", { url: this.url }),
    );
  }

  addMessageHandler = (
    messageHandler: OnMpcChangedCallback<MessagePayload>,
  ) => {
    this.eventSource.addEventListener(
      "message",
      async (event: MessageEvent<string>) => {
        const data = JSON.parse(event.data) as MessagePayload;
        try {
          await messageHandler(data);
        } catch (error) {
          console.error("Error handling SSE message", { error });
        }
      },
    );
  };

  close = () => {
    this.eventSource.close();
  };
}

export const PlayerStateSSEConnection = new SSEConnection<
  Partial<MPCStateChanges>
>(process.env.REACT_APP_BACKEND_URL + "/sse/stream");
