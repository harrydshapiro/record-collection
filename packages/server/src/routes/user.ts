import { Router } from "express";

import { fetchAllUsers } from "controllers/user/fetchAllUsers";
import handleUserAdmit from "controllers/user/handleUserAdmit";
import handleUserSignup from "controllers/user/handleUserSignup";
import { internalApiKeyMiddleware } from "auth/internalApiKey.middleware";

const userRouter = Router();

userRouter.post("/signup", handleUserSignup);
userRouter.post(
  "/admit/:phoneNumber",
  internalApiKeyMiddleware,
  handleUserAdmit,
);
userRouter.get("/", internalApiKeyMiddleware, fetchAllUsers);

export default userRouter;
