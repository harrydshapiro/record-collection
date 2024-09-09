import { Router } from "express";
import { handlePlay } from "./play";
import { handlePause } from "./pause";
import { handleGetQueue } from "./getQueue";
import { handleNext } from "./next";
import { handlePrevious } from "./previous";
import { handleAddTrackToQueue } from "./addTrackToQueue";
import { handleAddAlbumToQueue } from "./addAlbumToQueue";
import { handleRemoveItemsFromQueue } from "./removeItemsFromQueue";

export const playerRouter = Router();

playerRouter.post("/play", handlePlay);
playerRouter.post("/pause", handlePause);
playerRouter.post("/next", handleNext);
playerRouter.post("/previous", handlePrevious);

playerRouter.get("/queue", handleGetQueue);
playerRouter.post("/queue/track", handleAddTrackToQueue);
playerRouter.post("/queue/album", handleAddAlbumToQueue);
playerRouter.post("/queue/remove", handleRemoveItemsFromQueue);
