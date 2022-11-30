import { AppDataSource } from 'orm/DataSource';
import { Message } from 'orm/entities/Message';

export const messageRepository = AppDataSource.getRepository(Message);
