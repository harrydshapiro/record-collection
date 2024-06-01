import { RequestHandler } from "express";
import { MpcService } from "src/services/mpc.service";

export const handleGetAlbums: RequestHandler = async (req, res) => {
  try {
    const albums = await MpcService.getAlbums();
    return res.json(albums);
  } catch (err) {
    return res.json(err).sendStatus(500);
  }
};
