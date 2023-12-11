import { Router } from "express";
import smsRouter from "./sms";
import userRouter from "./user";
import submissionRequestsRouter from "./submission-requests";

const router = Router();

router.use("/sms", smsRouter);
router.use("/user", userRouter);
router.use("/submission-request", submissionRequestsRouter);

export default router;
