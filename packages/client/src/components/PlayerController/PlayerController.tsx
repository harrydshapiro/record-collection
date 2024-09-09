import React from "react";
import styles from "./PlayerController.module.scss";

interface PlayerControllerProps {
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  albumName?: string;
  artistName?: string;
  trackName?: string;
  isPlaying: boolean;
}

const PlayerController: React.FC<PlayerControllerProps> = ({
  onPlay,
  onPause,
  onNext,
  onPrevious,
  albumName = "Unknown Album",
  artistName = "Unknown Artist",
  trackName = "Unknown Track Name",
  isPlaying,
}) => {
  return (
    <div className={styles.playerController}>
      <div className={styles.currentSongInfo}>
        <p>{trackName}</p>
        <p>{albumName}</p>
        <p>{artistName}</p>
      </div>
      <div className={styles.controls}>
        <button onClick={onPrevious}>Previous</button>
        {isPlaying ? (
          <button onClick={onPause}>Stop</button>
        ) : (
          <button onClick={onPlay}>Play</button>
        )}
        <button onClick={onNext}>Next</button>
      </div>
    </div>
  );
};

export default PlayerController;
