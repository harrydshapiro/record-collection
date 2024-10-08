import { useCallback, useContext } from "react";
import { PlayerContext } from "../../state/player.context";
import PlayerController from "../../components/PlayerController/PlayerController";
import {
  addAlbumToQueue,
  nextTrack,
  pausePlayback,
  playPlayback,
  previousTrack,
} from "../../api/client";
import { LibraryContext } from "../../state/library.context";
import { Library } from "../../components/Library/Library";
import { AlbumId } from "@record-collection/server/src/types/api-contract";
import { Queue } from "../../components/Queue/Queue";
import styles from "./Home.module.scss";

export function HomePage() {
  const playerContext = useContext(PlayerContext);
  const libraryContext = useContext(LibraryContext);

  const currentSong = playerContext.player.currentSong;
  const { album, albumArtist, title, id: songId } = currentSong || {};

  // TODO: This should be abstracted... somewhere. Somehow. Search for selector-esque patterns for context
  // Should one context even know about the other? Might be an antipattern
  const getAlbum = useCallback(
    ({ albumName, artistName }: { albumName: string; artistName: string }) => {
      // eslint-disable-next-line no-debugger
      debugger;
      return libraryContext.albums.find(
        (a) => a.albumArtist === artistName && a.albumName === albumName,
      );
    },
    [libraryContext, album, albumArtist],
  );

  const currentAlbum =
    album && albumArtist
      ? getAlbum({ albumName: album, artistName: albumArtist })
      : undefined;

  return (
    <div className={styles.homeContainer}>
      <div className={styles.leftBar}>
        <Library
          albums={libraryContext.albums}
          onAlbumSelect={(albumId: AlbumId) => addAlbumToQueue(albumId)}
        />
      </div>
      <div className={styles.rightBar}>
        <div className={styles.playerContainerWrapper}>
          <PlayerController
            albumName={album}
            artistName={albumArtist}
            trackName={title}
            songId={songId}
            albumCoverArtUrl={currentAlbum?.albumCoverArtUrl}
            isPlaying={playerContext.player.status.state === "play"}
            onPlay={playPlayback}
            onPause={pausePlayback}
            onNext={nextTrack}
            onPrevious={previousTrack}
          />
        </div>
        <Queue currentQueue={playerContext.queue} />
      </div>
    </div>
  );
}
