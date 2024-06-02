import { useSelector } from "react-redux";
import { HomeTemplate } from "../../templates/Home/Home";
import { selectAlbums, updateAlbums } from "../../store/libraryReducer";
import { useEffect } from "react";

export function HomePage() {
  useEffect(() => {
    updateAlbums();
  }, []);

  const albums = useSelector(selectAlbums);

  return <HomeTemplate albums={albums}></HomeTemplate>;
}
