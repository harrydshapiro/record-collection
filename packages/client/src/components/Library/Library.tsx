import React from "react";
import styles from "./Library.module.scss";
import { GetAlbumsReturnType } from "@record-collection/server";
import { AlbumCover } from "../AlbumCover/AlbumCover";
import { AlbumId } from "@record-collection/server/src/types/api-contract";

type LibraryProps = {
  albums: GetAlbumsReturnType;
  onAlbumSelect: (albumId: AlbumId) => void;
};

export function Library({ albums, onAlbumSelect }: LibraryProps) {
  return (
    <div className={styles.libraryContainer}>
      {albums
        .sort((a, b) => (a.albumArtist > b.albumArtist ? 1 : -1))
        .map((a, index) => (
          <div className={styles.albumCoverWrapper} key={index}>
            <AlbumCover
              onClick={onAlbumSelect}
              albumId={a.albumId}
              artistName={a.albumArtist}
              albumName={a.albumName}
              albumArtUrl={a.albumCoverArtUrl}
            />
          </div>
        ))}
    </div>
  );
}