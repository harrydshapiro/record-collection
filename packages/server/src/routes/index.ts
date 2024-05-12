import { Router } from "express";
import { playerRouter } from "./player";
import { libraryRouter } from "./library";

const router = Router();

router.use('/player', playerRouter)
router.use('/library', libraryRouter)

export default router;
