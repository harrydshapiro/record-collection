import React, { useMemo, useState } from "react";
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
  "Recently Added": (a: GetAlbumsReturnType[0], b: GetAlbumsReturnType[0]) =>
    b.albumAddedAt - a.albumAddedAt,
});

type SortOption = keyof typeof SortOptions;

export function Library({ albums, onAlbumSelect }: LibraryProps) {
  const [sortOption, setSortOption] = useState<SortOption>("Recently Added");

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value as SortOption);
  };

  // TODO: This hash is needlessly large. Like, 15kb when I first introduced it
  // There are better ways to create a token for the current library. It should
  // happen in the BE for sure (not subject to tons of rerenders in the FE). And
  // it should be compressed. And it should be cached.
  const albumsHash = useMemo(
    () =>
      albums
        .sort((a, b) => (a.albumId > b.albumId ? 1 : -1))
        .reduce((acc, curr) => {
          return acc + curr.albumId;
        }, ""),
    [albums],
  );

  const sortedAlbums = useMemo(() => {
    return albums.sort(SortOptions[sortOption]);
  }, [albumsHash, sortOption]);

  return (
    <div className={styles.libraryContainer}>
      <div className={styles.sortSelectionContainer}>
        <label htmlFor="sortOptions">Sort by </label>
        <select id="sortOptions" value={sortOption} onChange={handleSortChange}>
          {Object.keys(SortOptions).map((option) => (
            <option value={option}>{option}</option>
          ))}
        </select>
      </div>
      {sortedAlbums.map((a, index) => (
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
