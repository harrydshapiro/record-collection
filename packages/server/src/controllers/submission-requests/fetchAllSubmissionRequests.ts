import { Request, Response } from "express";
import { SubmissionRequest } from "orm/entities/SubmissionRequest";
import { fetchSubmissionRequests } from "orm/repositories/submissionRequest.repository";

export async function fetchAllSubmissionRequests(
  req: Request<
    Record<string, never>,
    { submissionRequests: SubmissionRequest[] },
    never,
    { start?: string; end?: string }
  >,
  res: Response,
) {
  const start = req.query.start ? parseInt(req.query.start) : undefined;
  const end = req.query.end ? parseInt(req.query.end) : undefined;
  const submissionRequests = await fetchSubmissionRequests({ start, end });
  res.status(200).send(submissionRequests);
}
