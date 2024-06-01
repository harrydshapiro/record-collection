import { AlbumTile, AlbumTileProps } from "../../Molecules/AlbumTile/AlbumTile";

export function TileGallery({ tiles }: { tiles: AlbumTileProps[] }) {
  return (
    <div>
      {tiles.map((tile) => (
        <AlbumTile {...tile} />
      ))}
    </div>
  );
}
