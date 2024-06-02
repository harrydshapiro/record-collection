import { RequestHandler } from "express";
import { PlaylistItem } from "mpc-js";
import { GetAlbumsReturnType } from "../services/mpc.service";

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
      GET: RequestHandler<unknown, GetAlbumsReturnType, unknown, unknown>;
    };
  };
};
