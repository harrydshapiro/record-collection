import { Router } from "express";
import { handleGetAlbums } from "./getAlbums";
import { handleRefreshCache } from "./refreshCache";
import { handleUpdateDatabase } from "./updateDatabase";

export const libraryRouter = Router();

libraryRouter.get('/albums', handleGetAlbums);
libraryRouter.post('/refresh-cache', handleRefreshCache);
libraryRouter.post('/update', handleUpdateDatabase);