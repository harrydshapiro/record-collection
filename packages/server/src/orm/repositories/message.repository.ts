import { AppDataSource } from 'orm/DataSource';
import { Message } from 'orm/entities/Message';

export const messageRepository = AppDataSource.getRepository(Message);

export function queryUserMessages (phoneNumber: string) {
    return messageRepository.find({
        where: {
            user: {
                phoneNumber
            }
        },
        order: {
            createdAt: 'ASC'
        }
    })
}