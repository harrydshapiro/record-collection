import { Router } from "express";
import { handleGetStream } from "./stream";

export const sseRouter = Router();

sseRouter.get("/stream", handleGetStream);
