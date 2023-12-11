import { Request, Response } from "express";
import { updateSubmissionRequest } from "orm/repositories/submissionRequest.repository";
import { CreateSubmissionRequestInput } from "./CreateSubmissionRequestInput";

export async function handleUpdateSubmissionRequest(
  req: Request<
    { id: string },
    never,
    { input: Partial<CreateSubmissionRequestInput> },
    never
  >,
  res: Response,
) {
  const updatedSubmissionRequest = await updateSubmissionRequest(
    parseInt(req.params.id),
    req.body.input,
  );
  res.status(201).send(updatedSubmissionRequest);
}
