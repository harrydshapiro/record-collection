import { AppDataSource } from 'orm/DataSource';
import { User } from 'orm/entities/User';

export const userRepository = AppDataSource.getRepository(User);
