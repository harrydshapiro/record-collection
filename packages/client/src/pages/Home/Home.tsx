import { useSelector } from "react-redux"
import { selectAlbums } from "../../store/libraryReducer"
import { HomeTemplate } from "../../templates/Home/Home"

export function HomePage () {
  const albums = useSelector(selectAlbums)
  return <HomeTemplate tiles={Object.values(albums)}></HomeTemplate>
}