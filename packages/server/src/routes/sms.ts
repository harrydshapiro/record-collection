import { Router } from "express";

import { fetchUserMessages } from "controllers/sms/fetchUserMessages";
import handleIncomingMessage from "controllers/sms/handleIncomingMessage";
import { handleOutgoingMessage } from "controllers/sms/handleOutgoingMessage";
import { internalApiKeyMiddleware } from "auth/internalApiKey.middleware";

const smsRouter = Router();

smsRouter.post('/incoming', handleIncomingMessage)
smsRouter.post('/outgoing', internalApiKeyMiddleware, handleOutgoingMessage)
smsRouter.get('/:phoneNumber', internalApiKeyMiddleware, fetchUserMessages)

export default smsRouter