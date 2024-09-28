import { Router } from "express";
import { handleGetAlbums } from "./getAlbums";
import { handleUpdateDatabase } from "./updateDatabase";
import { handleGetCoverArt } from "./getCoverArt";
import { COVER_ART_FILE_NAME } from "../../services/library.helpers";

export const libraryRouter = Router();

libraryRouter.get("/albums", handleGetAlbums);
libraryRouter.post("/update", handleUpdateDatabase);
libraryRouter.get(`/album/:albumId/${COVER_ART_FILE_NAME}`, handleGetCoverArt);
