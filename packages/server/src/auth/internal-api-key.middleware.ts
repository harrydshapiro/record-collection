import { NextFunction, Request, Response } from "express";

export function internalApiKeyMiddleware (req: Request, res: Response, next: NextFunction) {
    if (!process.env.INTERNAL_API_KEY || req.cookies['x-internal-api-key'] !== process.env.INTERNAL_API_KEY) {
        res.sendStatus(403)
    }
    next()
}