import { AlbumTile, AlbumTileProps } from "../../Molecules/AlbumTile/AlbumTile";

export function TileGallery({
  tiles,
  onTileClick,
}: {
  tiles: AlbumTileProps[];
  onTileClick: ();
}) {
  return (
    <div>
      {tiles.map((tile) => (
        <AlbumTile {...tile} />
      ))}
    </div>
  );
}
