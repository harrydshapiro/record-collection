import { Router } from "express";
import { handleGetAlbums } from "./getAlbums";

export const libraryRouter = Router();

libraryRouter.get('/albums', handleGetAlbums);