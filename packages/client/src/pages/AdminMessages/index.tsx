import { IUser } from '@songhaus/server'
import react, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { fetchAllUsers } from '../../api/client'
import { MessageFeed } from '../../components/MessageFeed'
import { MessageForm } from '../../components/MessageForm'
import { UserList } from '../../components/UserList'
import { selectHasAdminAuth } from '../../store/userReducer'

import styles from './index.module.scss'

export function AdminMessages (): JSX.Element {
    const hasAdminAuth = useSelector(selectHasAdminAuth)

    const [users, setUsers] = useState<IUser[]>([])

    const [selectedUser, setSelecteduser] = useState<IUser | null>(null)

    const messageFeedContainerRef = useRef<HTMLDivElement>(null)
    
    useEffect(() => {
        if (hasAdminAuth) {
            fetchAllUsers().then((res) => { 
                const data = res.data.users;
                setUsers(data)}
            )
        }
    }, [hasAdminAuth])

    useEffect(() => {
        if (!messageFeedContainerRef.current) {
            return
        }
        messageFeedContainerRef.current.scrollTop = messageFeedContainerRef.current.scrollHeight
    }, [selectedUser])

    if (!hasAdminAuth) {
        return <Navigate to="/"/>
    }

    return (
        <div id={styles.page}>
            <div className={styles.userListContainer}>
                <UserList users={users} selectHandler={setSelecteduser} selectedUser={selectedUser}/>
            </div>
            {
                selectedUser && (
                    <div className={styles.messagingContainer}>
                        <div className={styles.messageFeedContainer} ref={messageFeedContainerRef}>
                            <MessageFeed user={selectedUser}/>
                        </div>
                        <MessageForm toNumber={selectedUser.phoneNumber}/>
                    </div>
                )
            }
        </div>
    )
}