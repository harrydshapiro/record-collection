import { Router } from "express";

import { internalApiKeyMiddleware } from "auth/internalApiKey.middleware";
import { fetchAllSubmissionRequests } from "controllers/submission-requests/fetchAllSubmissionRequests";
import { handleCreateSubmissionRequest } from "controllers/submission-requests/handleCreateSubmissionRequest";
import { handleUpdateSubmissionRequest } from "controllers/submission-requests/handleUpdateSubmissionRequest";
import { handleFetchSubmissionRequest } from "controllers/submission-requests/fetchSubmissionRequest";

const submissionRequestsRouter = Router();

submissionRequestsRouter.post(
  "/",
  internalApiKeyMiddleware,
  handleCreateSubmissionRequest,
);

submissionRequestsRouter.post(
  "/:id",
  internalApiKeyMiddleware,
  handleUpdateSubmissionRequest,
);

submissionRequestsRouter.get(
  "/",
  internalApiKeyMiddleware,
  fetchAllSubmissionRequests,
);

submissionRequestsRouter.get(
  "/:id",
  internalApiKeyMiddleware,
  handleFetchSubmissionRequest,
);

export default submissionRequestsRouter;
