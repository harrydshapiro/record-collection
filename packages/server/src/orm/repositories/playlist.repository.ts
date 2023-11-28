import { AppDataSource } from 'src/orm/DataSource';
import { Playlist } from 'src/orm/entities/Playlist';

export const messageRepository = AppDataSource.getRepository(Playlist);
