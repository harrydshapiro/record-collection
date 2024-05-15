import { RequestHandler } from "express";
import { MpcService } from "../../services/mpc.service";

export const handleUpdateDatabase: RequestHandler = async (req, res) => {
  try {
    await MpcService.update()
    return res.sendStatus(201)
  } catch (err) {
    return res.json(err).sendStatus(500)
  }
}