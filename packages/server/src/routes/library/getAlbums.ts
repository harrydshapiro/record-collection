import { RequestHandler } from "express";
import { libraryCache } from "../../services/library-cache.service";

export const handleGetAlbums: RequestHandler = async (req, res) => {
  try {
    const { albums } = await libraryCache.getCache()
    return res.json(albums)
  } catch (err) {
    return res.json(err).sendStatus(500)
  }
}