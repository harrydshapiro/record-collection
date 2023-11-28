import { NextFunction, Request, Response } from "express";
import { findAllActiveUsers } from "src/orm/repositories/user.repository";

export async function fetchAllUsers (req: Request, res: Response, next: NextFunction) {
    const users = await findAllActiveUsers()
    res.status(200).send({ users })
}