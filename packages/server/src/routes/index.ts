import { Router } from "express";
import smsRouter from "./sms";
import userRouter from "./user";

const router = Router();

router.use("/sms", smsRouter);
router.use("/user", userRouter);

export default router;
