import { RequestHandler } from "express";
import { MpcService } from "../../services/mpc.service";

export const handleAddAlbumToQueue: RequestHandler<
  unknown,
  unknown,
  { albumId: string }
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
