import { RequestHandler } from "express";
import { MpcService } from "../../services/mpc.service";

export const handlePlay: RequestHandler = async (req, res) => {
  try {
    const playResult = await MpcService.play();
    return res.status(200).send(playResult);
  } catch (err) {
    return res.status(500).send(err);
  }
}
