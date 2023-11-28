import { AppDataSource } from 'src/orm/DataSource';
import { User } from 'src/orm/entities/User';

export const userRepository = AppDataSource.getRepository(User);

export function findAllActiveUsers () {
    return userRepository.find({
        where: {
            active: true
        },
        order: {
            firstName: 'ASC'
        }
    })
}