import { RequestHandler } from "express";
import { MpcService } from "../../services/mpc.service";

export const handleRemoveItemsFromQueue: RequestHandler<
  unknown,
  unknown,
  { songIdsToRemove: number[] }
> = async (req, res) => {
  try {
    const { songIdsToRemove } = req.body;
    await MpcService.removeItemsFromQueue(songIdsToRemove);
    return res.sendStatus(201);
  } catch (err) {
    return res.status(500).send(err);
  }
};
