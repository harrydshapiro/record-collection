import { RequestHandler } from "express";
import { MpcService } from "../../services/mpc.service";

export const handleAddTrackToQueue: RequestHandler = async (req, res) => {
  try {
    const addTrackToQueueResult = await MpcService.addTrackToQueue(req.body.trackId);
    return res.json(addTrackToQueueResult).sendStatus(200)
  } catch (err) {
    return res.json(err).sendStatus(500)
  }
}
