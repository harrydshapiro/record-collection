import { AppDataSource } from "orm/DataSource";
import { Playlist } from "orm/entities/Playlist";

export const playlistRepository = AppDataSource.getRepository(Playlist);

export function findAllPlaylists() {
  return playlistRepository.find();
}
