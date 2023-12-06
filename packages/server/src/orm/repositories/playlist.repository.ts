import { AppDataSource } from "orm/DataSource";
import { Playlist } from "orm/entities/Playlist";

export const messageRepository = AppDataSource.getRepository(Playlist);
