import { AppDataSource } from 'orm/DataSource';
import { User } from 'orm/entities/User';

export const userRepository = AppDataSource.getRepository(User);

export function findAllActiveUsers () {
    return userRepository.find({
        where: {
            active: true
        }
    })
}