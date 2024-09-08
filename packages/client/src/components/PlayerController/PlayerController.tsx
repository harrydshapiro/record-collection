import React from "react";

interface PlayerControllerProps {
  currentTrack?: {
    trackName: string;
    artistName: string;
    albumName: string;
  };
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const defaultTrackData: PlayerControllerProps["currentTrack"] = {
  trackName: "No track",
  artistName: "No artist",
  albumName: "No album",
};

const PlayerController: React.FC<PlayerControllerProps> = ({
  currentTrack = defaultTrackData,
  onPlay,
  onPause,
  onNext,
  onPrevious,
}) => {
  return (
    <div className="player-controller">
      <div className="track-info">
        <h3>{currentTrack.trackName}</h3>
        <p>{currentTrack.artistName}</p>
        <p>{currentTrack.albumName}</p>
      </div>
      <div className="controls">
        <button onClick={onPrevious}>Previous</button>
        <button onClick={onPause}>Pause</button>
        <button onClick={onPlay}>Play</button>
        <button onClick={onNext}>Next</button>
      </div>
    </div>
  );
};

export default PlayerController;
