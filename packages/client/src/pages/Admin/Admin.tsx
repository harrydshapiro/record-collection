import { IUser, IPlaylist } from '@songhaus/server'
import react from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { UserList } from '../../components/UserList'
import { selectHasAdminAuth } from '../../store/userReducer'

export function Admin (): JSX.Element {
    const hasAdminAuth = useSelector(selectHasAdminAuth)

    if (!hasAdminAuth) {
        return <Navigate to="/"/>
    }

    return <UserList users={[{ firstName: 'harry', lastName: 'shapiro', phoneNumber: '+19176475261', spotifyUri: 'www.foo.com', active: true, id: '', messages: [], personalPlaylist: ({} as IPlaylist)}]} selectHandler={(user: IUser) => {
        console.log('user is', user)
    }}/>
}