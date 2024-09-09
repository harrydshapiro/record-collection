import React from "react";
import styles from "./Library.module.scss";
import { GetAlbumsReturnType } from "@record-collection/server";
import { AlbumCover } from "../AlbumCover/AlbumCover";

type LibraryProps = {
  albums: GetAlbumsReturnType;
  onAlbumSelect: (albumId: string) => void;
};

export function Library({ albums, onAlbumSelect }: LibraryProps) {
  return (
    <div className={styles.libraryContainer}>
      {albums.map((a, index) => (
        <div className={styles.albumCoverWrapper} key={index}>
          <AlbumCover
            onClick={onAlbumSelect}
            albumId={a.albumId}
            artistName={a.albumArtist}
            albumName={a.albumName}
          />
        </div>
      ))}
    </div>
  );
}
