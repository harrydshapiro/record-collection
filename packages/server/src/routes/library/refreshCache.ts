import { RequestHandler } from "express";
import { libraryCache } from "../../services/library-cache.service";

export const handleRefreshCache: RequestHandler = async (req, res) => {
  try {
    await libraryCache.refreshCache()
    const newCache = libraryCache.getCache()
    return res.json(newCache)
  } catch (err) {
    return res.json(err).sendStatus(500)
  }
}