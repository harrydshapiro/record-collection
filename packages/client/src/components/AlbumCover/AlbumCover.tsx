import React from "react";
import styles from "./AlbumCover.module.scss";
import { AlbumId } from "@record-collection/server/src/types/api-contract";

type AlbumCoverProps = {
  onClick?: (albumId: AlbumId) => void;
  albumName: string;
  artistName: string;
  albumId?: AlbumId;
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
        onClick && albumId && onClick(albumId);
      }}
    >
      {albumArtUrl && (
        <img src={albumArtUrl} className={styles.albumCoverArt} loading="lazy"></img>
      )}
      {trackName && <p>{trackName}</p>}
      <p>{albumName}</p>
      <p>{artistName}</p>
    </div>
  );
}
