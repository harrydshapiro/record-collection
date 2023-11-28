import { AppDataSource } from 'src/orm/DataSource';
import { SubmissionRequest } from 'src/orm/entities/SubmissionRequest';
import { SubmittedTrack } from 'src/orm/entities/SubmittedTrack';
import { Track } from 'src/orm/entities/Track';
import { User } from 'src/orm/entities/User';

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