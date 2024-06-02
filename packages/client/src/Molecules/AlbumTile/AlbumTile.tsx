import { GetAlbumsReturnType } from "@songhaus/server";
import { Image } from "../../components/Image/Image";
import { Text } from "../../components/Text/Text";
import styles from "./AlbumTile.module.scss";

export function AlbumTile({
  albumArtist,
  albumName,
  onClick,
}: GetAlbumsReturnType[0] & { onClick: () => unknown }) {
  return (
    <div className={styles.albumTile} onClick={() => }>
      <Image
        src={imageSrc || "default-image.png"}
        title={`${albumName} by ${artistName}`}
      />
      <div className={styles.ablumTileTextContainer}>
        <Text content={albumName} style={"body"} />
        <Text content={artistName} style={"body"} />
      </div>
    </div>
  );
}
