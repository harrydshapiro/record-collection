import { Request, Response } from "express";
import { MpcService } from "../../services/mpc.service";

export async function handleGetStream(req: Request, res: Response) {
  // Set headers for SSE connection
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  const subscription = await MpcService.addStateStreamSubscriber(
    (eventData) => {
      res.write(`data: ${JSON.stringify(eventData)}\n\n`);
    },
  );

  res.on("close", () => {
    subscription.unsubscribe();
  });
}
