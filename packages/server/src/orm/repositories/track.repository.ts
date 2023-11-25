import { AppDataSource } from 'orm/DataSource';
import { Track } from 'orm/entities/Track';

const trackRepository = AppDataSource.getRepository(Track);
