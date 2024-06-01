import { Image } from "../../components/Image/Image";
import { Text } from "../../components/Text/Text";
import styles from "./AlbumTile.module.scss";

export type AlbumTileProps = {
  imageSrc: string;
  artistName: string;
  albumName: string;
  onClick: () => void;
};

export function AlbumTile({
  imageSrc,
  artistName,
  albumName,
  onClick,
}: AlbumTileProps) {
  return (
    <div className={styles.albumTile} onClick={onClick}>
      <Image src={imageSrc} title={`${albumName} by ${artistName}`} />
      <div className={styles.ablumTileTextContainer}>
        <Text content={albumName} style={"body"} />
        <Text content={artistName} style={"body"} />
      </div>
    </div>
  );
}
