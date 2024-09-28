import React from "react";
import styles from "./PlayerController.module.scss";
import { Button } from "../Button/Button";

interface PlayerControllerProps {
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  albumName?: string;
  artistName?: string;
  trackName?: string;
  albumCoverArtUrl?: string;
  isPlaying: boolean;
  songId?: number;
}

const PlayerController: React.FC<PlayerControllerProps> = ({
  onPlay,
  onPause,
  onNext,
  onPrevious,
  albumName = "Unknown Album",
  artistName = "Unknown Artist",
  trackName = "Unknown Track Name",
  albumCoverArtUrl = "",
  songId,
  isPlaying,
}) => {
  return (
    <div className={styles.playerController}>
      <div className={styles.currentSongInfo}>
        {typeof songId === "number" ? (
          <>
            {albumCoverArtUrl && (
              <img
                src={albumCoverArtUrl}
                alt={`Cover art - ${albumName}`}
                className={styles.albumCoverArt}
              />
            )}
            <p>{trackName}</p>
            <p>{albumName}</p>
            <p>{artistName}</p>
          </>
        ) : (
          <>
            <p>Nuthin playin...</p>
            <br></br>
            <br></br>
          </>
        )}
      </div>
      <div className={styles.controls}>
        <Button
          onClick={onPrevious}
          text={"Previous"}
          className={styles.button}
        />
        {isPlaying ? (
          <Button onClick={onPause} text={"Stop"} className={styles.button} />
        ) : (
          <Button onClick={onPlay} text={"Play"} className={styles.button} />
        )}
        <Button onClick={onNext} text={"Next"} className={styles.button} />
      </div>
    </div>
  );
};

export default PlayerController;
