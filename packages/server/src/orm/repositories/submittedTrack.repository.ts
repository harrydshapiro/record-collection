import { AppDataSource } from "orm/DataSource";
import { SubmittedTrack } from "orm/entities/SubmittedTrack";

const submittedTrackRepository = AppDataSource.getRepository(SubmittedTrack);

export function addSubmittedTrack({
  trackId,
  userId,
  submissionRequestId,
  popularityAtSubmissionTime,
}: {
  trackId: string;
  userId: string;
  submissionRequestId: number;
  popularityAtSubmissionTime: number;
}) {
  return submittedTrackRepository.query(`
    INSERT INTO submitted_tracks
    ("track_id","user_id","submission_request_id","popularity_at_submission_time")
    VALUES ('${trackId}','${userId}','${submissionRequestId}',${popularityAtSubmissionTime})
    ON CONFLICT DO NOTHING
  `);
}

export function getSubmittedTracksForSubmissionRequest(
  submissionRequestId: number,
) {
  return submittedTrackRepository.find({
    where: {
      submissionRequest: {
        id: submissionRequestId,
      },
    },
  });
}
