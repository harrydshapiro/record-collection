import { AppDataSource } from 'orm/DataSource';
import { Track } from 'orm/entities/Track';

const trackRepository = AppDataSource.getRepository(Track);

export function getFullTrackContext(trackUri: string) {
  return trackRepository.findOne({
    where: {
      uri: trackUri
    },
    relations: {
      artists: {
        genres: true
      }
    }
  })
}

export async function upsertTrack(track: Track) {
  const existingTrack = await trackRepository.findOne({ where: { uri: track.uri }})
  if (existingTrack) {
    return existingTrack
  }
  return trackRepository.save(track)
}