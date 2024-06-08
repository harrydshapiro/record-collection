import { useDispatch, useSelector } from "react-redux";
import { selectAlbums, updateAlbums } from "../../store/libraryReducer";
import { useEffect } from "react";

export function HomePage() {
  const dispatch = useDispatch();

  useEffect(() => dispatch(() => updateAlbums()), []);

  const albums = useSelector(selectAlbums);

  return (
    <>
      {albums.map((album) => (
        <div>
          <p>{album.albumName}</p>
          <p>{album.albumArtist}</p>
        </div>
      ))}
    </>
  );
}
