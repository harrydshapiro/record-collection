import { RequestHandler } from "express";
import { MpcService } from "../../services/mpc.service";
import { AlbumId } from "../../types/api-contract";

export const handleAddAlbumToQueue: RequestHandler<
  unknown,
  unknown,
  { albumId: AlbumId }
> = async (req, res) => {
  try {
    const addAlbumToQueueResult = await MpcService.addAlbumToQueue(
      req.body.albumId,
    );
    return res.status(200).send(addAlbumToQueueResult);
  } catch (err) {
    return res.status(500).send(err);
  }
};
