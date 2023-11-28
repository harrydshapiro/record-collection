import { AppDataSource } from 'orm/DataSource';
import { SubmissionRequest } from 'orm/entities/SubmissionRequest';
import { SubmittedTrack } from 'orm/entities/SubmittedTrack';
import { Track } from 'orm/entities/Track';
import { User } from 'orm/entities/User';

const submittedTrackRepository = AppDataSource.getRepository(SubmittedTrack);

export function addSubmittedTrack ({ trackId, userId, submissionRequestId, popularityAtSubmissionTime }: { trackId: string, userId: string, submissionRequestId: number, popularityAtSubmissionTime: number }) {
  return submittedTrackRepository.query(`
    INSERT INTO submitted_tracks
    ("track_id","user_id","submission_request_id","popularity_at_submission_time")
    VALUES ('${trackId}','${userId}','${submissionRequestId}',${popularityAtSubmissionTime})
    ON CONFLICT DO NOTHING
  `)
}