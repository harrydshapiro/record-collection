import { Request, Response } from "express";
import { SubmissionRequest } from "orm/entities/SubmissionRequest";
import { fetchSubmissionRequest } from "orm/repositories/submissionRequest.repository";

export async function handleFetchSubmissionRequest(
  req: Request<{ id: string }, SubmissionRequest, never, never>,
  res: Response,
) {
  const submissionRequest = await fetchSubmissionRequest(
    parseInt(req.params.id),
  );
  res.status(200).send(submissionRequest);
}
