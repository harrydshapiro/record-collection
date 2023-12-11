import { Request, Response } from "express";
import { createSubmissionRequest } from "orm/repositories/submissionRequest.repository";
import { CreateSubmissionRequestInput } from "./CreateSubmissionRequestInput";

export async function handleCreateSubmissionRequest(
  req: Request<
    Record<string, never>,
    never,
    { input: CreateSubmissionRequestInput },
    never
  >,
  res: Response,
) {
  const submissionRequest = await createSubmissionRequest(req.body.input);
  res.status(201).send(submissionRequest);
}
