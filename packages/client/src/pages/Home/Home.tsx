import { useContext } from "react";
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
            albumName={playerContext.player.currentSong.album}
            artistName={playerContext.player.currentSong.albumArtist}
            trackName={playerContext.player.currentSong.title}
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
