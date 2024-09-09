import { RequestHandler } from "express";
import { MpcService } from "../../services/mpc.service";

export const handleRemoveItemsFromQueue: RequestHandler = async (req, res) => {
  try {
    const nextResult = await MpcService.next();
    return res.status(200).send(nextResult);
  } catch (err) {
    return res.status(500).send(err);
  }
};
