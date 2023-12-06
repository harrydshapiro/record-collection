import { Request, Response } from "express";
import { findAllActiveUsers } from "orm/repositories/user.repository";

export async function fetchAllUsers(req: Request, res: Response) {
  const users = await findAllActiveUsers();
  res.status(200).send({ users });
}
