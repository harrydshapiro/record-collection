import { AppDataSource } from 'orm/DataSource';
import { Album } from 'orm/entities/Album';

const albumRepository = AppDataSource.getRepository(Album);

export function getAlbum (uri: string) {
  return albumRepository.findOne({ where: { uri }, relations: ['tracks', 'artists', 'genres']})
}

export async function upsertAlbum(album: Album) {
  const existingAlbum = await albumRepository.findOne({ where: { uri: album.uri }})
  if (existingAlbum) {
    return existingAlbum
  }
  return albumRepository.save(album)
}
