import react from 'react'

import { IUser } from '@songhaus/server'

import styles from './index.module.scss'
import clsx from 'clsx'

export function UserList ({ users, selectHandler, selectedUser }: { users: IUser[], selectHandler: (user: IUser) => void, selectedUser: IUser | null }): JSX.Element {
    return (
        <div className={styles.userListWrapper}>
            {users.map((user, index) => (
                <div onClick={() => selectHandler(user)} key={index} className={clsx(styles.userItem, selectedUser?.id === user.id ? styles.selected : '')}>
                    {user.firstName} {user.lastName}
                </div>
            ))}
        </div>
    )
}