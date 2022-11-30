import { Router } from "express";

import { fetchAllUsers } from "controllers/user/fetchAllUsers";
import handleUserAdmit from "controllers/user/handleUserAdmit";
import handleUserSignup from "controllers/user/handleUserSignup";
import { internalApiKeyMiddleware } from "src/auth/internal-api-key.middleware";

export const userRouter = Router();

userRouter.post('/signup', handleUserSignup)
userRouter.post('/admit', internalApiKeyMiddleware, handleUserAdmit)
userRouter.get('/', internalApiKeyMiddleware, fetchAllUsers)