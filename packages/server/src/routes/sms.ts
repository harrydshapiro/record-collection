import { Router } from "express";

import { internalApiKeyMiddleware } from "src/auth/internal-api-key.middleware";

import { fetchUserMessages } from "controllers/sms/fetchUserMessages";
import handleIncomingMessage from "controllers/sms/handleIncomingMessage";
import { handleOutgoingMessage } from "controllers/sms/handleOutgoingMessage";

export const smsRouter = Router();

smsRouter.post('/incoming', handleIncomingMessage)
smsRouter.post('/outgoing', internalApiKeyMiddleware, handleOutgoingMessage)
smsRouter.get('/:phoneNumber', internalApiKeyMiddleware, fetchUserMessages)