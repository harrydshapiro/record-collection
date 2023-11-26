import { AppDataSource } from 'orm/DataSource';
import { SubmissionRequest } from 'orm/entities/SubmissionRequest';
import { SubmittedTrack } from 'orm/entities/SubmittedTrack';
import { Track } from 'orm/entities/Track';
import { User } from 'orm/entities/User';

const submittedTrackRepository = AppDataSource.getRepository(SubmittedTrack);

export function addSubmittedTrack ({ trackId, userId, submissionRequestId, popularityAtSubmissionTime }: { trackId: string, userId: string, submissionRequestId: number, popularityAtSubmissionTime: number }) {
  return submittedTrackRepository.save(new SubmittedTrack({
    track: new Track({ id: trackId }),
    user: new User({ id: userId }),
    submissionRequest: new SubmissionRequest({ id: submissionRequestId }),
    popularityAtSubmissionTime,
    submittedAt: new Date()
  }))
}