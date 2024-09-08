import { Router } from "express";
import { playerRouter } from "./player";
import { libraryRouter } from "./library";
import { sseRouter } from "./sse";

const router = Router();

router.use("/player", playerRouter);
router.use("/library", libraryRouter);
router.use("/sse", sseRouter);

export default router;
