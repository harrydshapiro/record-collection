import { Router } from "express";
import { handleGetAlbums } from "./getAlbums";
import { handleRefreshCache } from "./refreshCache";

export const libraryRouter = Router();

libraryRouter.get('/albums', handleGetAlbums);
libraryRouter.post('/refresh-cache', handleRefreshCache);