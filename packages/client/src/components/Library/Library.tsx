import React, { useState } from "react";
import styles from "./Library.module.scss";
import { GetAlbumsReturnType } from "@record-collection/server";
import { AlbumCover } from "../AlbumCover/AlbumCover";
import { AlbumId } from "@record-collection/server/src/types/api-contract";

type LibraryProps = {
  albums: GetAlbumsReturnType;
  onAlbumSelect: (albumId: AlbumId) => void;
};

const SortOptions = Object.freeze({
  "A-Z Artist": (a: GetAlbumsReturnType[0], b: GetAlbumsReturnType[0]) =>
    a.albumArtist === b.albumArtist
      ? a.albumName > b.albumName
        ? 1
        : -1
      : a.albumArtist > b.albumArtist
        ? 1
        : -1,
  Shuffle: () => (Math.random() > 0.5 ? 1 : -1),
});

type SortOption = keyof typeof SortOptions;

export function Library({ albums, onAlbumSelect }: LibraryProps) {
  const [sortOption, setSortOption] = useState<SortOption>("Shuffle");

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value as SortOption);
  };

  return (
    <div className={styles.libraryContainer}>
      <div className={styles.sortSelectionContainer}>
        <label htmlFor="sortOptions">Sort by </label>
        <select id="sortOptions" value={sortOption} onChange={handleSortChange}>
          <option value="A-Z Artist">A-Z Artist</option>
          <option value="Shuffle">Shuffle</option>
        </select>
      </div>
      {albums.sort(SortOptions[sortOption]).map((a, index) => (
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
