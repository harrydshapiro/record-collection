import { RequestHandler } from "express";
import { MpcService } from "../../services/mpc.service";

export const handlePause: RequestHandler = async (req, res) => {
  try {
    const pauseResult = await MpcService.pause();
    return res.status(200).send(pauseResult);
  } catch (err) {
    return res.status(500).send(err);
  }
}
