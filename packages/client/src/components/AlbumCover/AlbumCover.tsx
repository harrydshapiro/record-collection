import React from "react";
import styles from "./AlbumCover.module.scss";

type AlbumCoverProps = {
  onClick?: (albumId: string) => void;
  albumName: string;
  artistName: string;
  albumId: string;
  albumArtUrl?: string;
  trackName?: string;
  trackId?: string;
};

export function AlbumCover({
  onClick,
  albumId,
  albumName,
  artistName,
  trackName,
  albumArtUrl,
}: AlbumCoverProps) {
  return (
    <div
      className={styles.AlbumCoverContainer}
      onClick={() => {
        onClick && onClick(albumId);
      }}
    >
      {albumArtUrl && <img src={albumArtUrl}></img>}
      {trackName && <p>{trackName}</p>}
      <p>{albumName}</p>
      <p>{artistName}</p>
    </div>
  );
}
