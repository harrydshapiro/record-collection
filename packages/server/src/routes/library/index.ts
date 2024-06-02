import { Router } from "express";
import { handleGetAlbums } from "./getAlbums";
import { handleUpdateDatabase } from "./updateDatabase";

export const libraryRouter = Router();

libraryRouter.get("/albums", handleGetAlbums);
libraryRouter.post("/update", handleUpdateDatabase);
