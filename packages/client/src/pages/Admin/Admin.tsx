import { IUser, IPlaylist } from '@songhaus/server'
import react from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { UserList } from '../../components/UserList'
import { selectHasAdminAuth } from '../../store/userReducer'

const users = [{ firstName: 'harry', lastName: 'shapiro', phoneNumber: '+19176475261', spotifyUri: 'www.foo.com', active: true, id: '', messages: [], personalPlaylist: ({} as IPlaylist)}]

export function Admin (): JSX.Element {
    const hasAdminAuth = useSelector(selectHasAdminAuth)

    if (!hasAdminAuth) {
        return <Navigate to="/"/>
    }

    return (
    <div id="page">
        <UserList users={users} selectHandler={(user: IUser) => {
            console.log('user is', user)
        }}/>
    </div>)
}