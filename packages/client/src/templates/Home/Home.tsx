import { AlbumTileProps } from "../../Molecules/AlbumTile/AlbumTile";
import { PlayableQueue } from "../../Organisms/PlayableQueue/PlayableQueue";
import { TileGallery } from "../../Organisms/TileGallery/TileGallery";

export function HomeTemplate ({ tiles }: { tiles: AlbumTileProps[] }) {
  return (
    <>
      <PlayableQueue></PlayableQueue>
      <TileGallery tiles={tiles}></TileGallery>
    </>
  )
}