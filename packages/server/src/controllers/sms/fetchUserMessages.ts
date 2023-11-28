import { NextFunction, Request, Response } from "express";
import { messageRepository, queryUserMessages } from "src/orm/repositories/message.repository";

export async function fetchUserMessages (req: Request, res: Response, next: NextFunction) {
    const phoneNumber = req.params.phoneNumber;

    if (!phoneNumber) {
        res.sendStatus(404)
        return
    }

    const messages = await queryUserMessages(phoneNumber)

    return res.status(200).send({ messages })
}