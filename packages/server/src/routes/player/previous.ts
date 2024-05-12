import { RequestHandler } from "express";
import { MpcService } from "../../services/mpc.service";

export const handlePrevious: RequestHandler = async (req, res) => {
  try {
    const previousResult = await MpcService.previous();
    return res.status(200).send(previousResult);
  } catch (err) {
    return res.status(500).send(err);
  }
}
