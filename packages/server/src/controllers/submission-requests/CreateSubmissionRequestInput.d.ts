export type CreateSubmissionRequestInput = {
  requestText: string;
  scheduledFor?: number;
  submissionResponse: string;
  playlistId: number;
  mediaUrl?: string;
};
