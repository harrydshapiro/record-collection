import { Router } from "express";

import { internalApiKeyMiddleware } from "auth/internalApiKey.middleware";
import { fetchAllPlaylists } from "controllers/playlists/fetchAllPlaylists";

const playlistsRouter = Router();

playlistsRouter.get("/", internalApiKeyMiddleware, fetchAllPlaylists);

export default playlistsRouter;
