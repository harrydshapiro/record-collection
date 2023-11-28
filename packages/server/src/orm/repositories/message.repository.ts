import { AppDataSource } from 'src/orm/DataSource';
import { Message } from 'src/orm/entities/Message';

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