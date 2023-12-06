import { Request, Response } from "express";
import { sendMessageToPhoneNumber } from "utils/phone";

export async function handleOutgoingMessage(req: Request, res: Response) {
  const requestBody = req.body as { toNumber: string; messageBody: string };
  await sendMessageToPhoneNumber(requestBody.messageBody, requestBody.toNumber);
  res.sendStatus(201);
}
