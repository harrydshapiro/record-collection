import { RequestHandler } from "express";
import { MpcService } from "../../services/mpc.service";

/**
 * TODO: 
 * 1. Will need to add pagination. Let's do range-based with a start index, sort crriteria, and a take count.
 * 2. Will need to do some funky stuff in returning my shit. I think we need to get all tracks and sort by their album and basically not stop until we hit our number of unique albums? But then that sorta breaks part of the concept of the pagination... hmmmm...
 */

export const handleGetAlbums: RequestHandler = async (req, res) => {
  try {
    const result = await MpcService.getAlbums()
    return res.json(result)
  } catch (err) {
    return res.json(err).sendStatus(500)
  }
}