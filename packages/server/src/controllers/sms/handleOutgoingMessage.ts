import { NextFunction, Request, Response } from "express";
import { sendMessageToPhoneNumber } from "utils/phone";

export async function handleOutgoingMessage (req: Request, res: Response, next: NextFunction) {
    const { toNumber, messageBody } = req.body;

    await sendMessageToPhoneNumber(messageBody, toNumber)
    res.sendStatus(201)
}