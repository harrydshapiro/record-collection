import { RequestHandler } from "express";
import { ReadStream } from "fs";
import { PlaylistItem, Song, Status } from "mpc-js";

export type API = {
  player: {
    getQueue: {
      GET: RequestHandler<
        unknown,
        | {
            fullQueue: PlaylistItem[];
            currentIndex?: number;
          }
        | Error,
        unknown,
        unknown
      >;
    };
  };
  library: {
    albums: {
      GET: RequestHandler<
        unknown,
        GetAlbumsReturnType | Error,
        unknown,
        unknown
      >;
    };
    album: {
      albumId: {
        ["cover-art"]: {
          GET: RequestHandler<
            { albumId: AlbumId },
            ReadStream | Error,
            unknown,
            unknown
          >;
        };
      };
    };
  };
};

type SoundSystemUpdateMap = {
  queue: {
    fullQueue: Array<PlaylistItem>;
    currentIndex?: number;
  };
  player: {
    currentSong?: PlaylistItem;
    status: Status;
  };
  database: null;
  update: null;
  stored_playlist: null;
  mixer: null;
  output: null;
  options: null;
  sticker: null;
  subscription: null;
  message: null;
};

export type SoundSystemUpdate<T extends keyof SoundSystemUpdateMap> = {
  type: T;
  payload: SoundSystemUpdateMap[T];
};

/**
 * These are just the updates we currently support
 */
export type SoundSystemUpdates =
  | SoundSystemUpdate<"player">
  | SoundSystemUpdate<"queue">;

/**
 * i.e. "album#Continuum#artist#John Mayer"
 */
type AlbumId = `album#${string}#artist${string}`;

export type GetAlbumsReturnType = Array<{
  albumId: AlbumId;
  albumName: string;
  albumArtist: string;
  albumCoverArtUrl?: string;
  albumAddedAt: number;
}>;
