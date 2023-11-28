import { AppDataSource } from 'orm/DataSource';
import { Artist } from 'orm/entities/Artist';

const artistRepository = AppDataSource.getRepository(Artist);

export async function upsertArtists(artists: Artist[]): Promise<Pick<Artist, 'id'>[]> {
  return Promise.all(artists.map(async artist => {
    const existingArtist = await artistRepository.findOne({ where: { uri: artist.uri }})
    if (existingArtist) {
      return existingArtist
    }
    return artistRepository.save(artist)  
  }))
}
