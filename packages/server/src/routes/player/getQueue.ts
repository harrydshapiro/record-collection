import { RequestHandler } from "express";
import { MpcService } from "../../services/mpc.service";

export const handleGetQueue: RequestHandler = async (req, res) => {
  try {
    const queueResult = await MpcService.getQueue();
    return res.status(200).send(queueResult);
  } catch (err) {
    return res.status(500).send(err);
  }
};
