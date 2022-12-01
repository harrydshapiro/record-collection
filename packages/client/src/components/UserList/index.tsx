import react from 'react'

import { IUser } from '@songhaus/server'

import styles from './index.module.scss'

export function UserList ({ users, selectHandler }: { users: IUser[], selectHandler: (user: IUser) => void }): JSX.Element {
    return (
        <div className={styles.userListWrapper}>
            {users.map((user, index) => (
                <div onClick={() => selectHandler(user)} key={index} className={styles.userItem}>
                    {user.firstName} {user.lastName}
                </div>
            ))}
        </div>
    )
}