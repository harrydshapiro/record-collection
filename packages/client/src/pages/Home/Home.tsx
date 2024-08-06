import { useContext } from "react";
import { PlayerContext } from "../../state/player.context";
import PlayerController from "../../components/PlayerController/PlayerController";
import {
  nextTrack,
  pausePlayback,
  playPlayback,
  previousTrack,
} from "../../api/client";

export function HomePage() {
  const playerContext = useContext(PlayerContext);

  return (
    <>
      <PlayerController
        currentTrack={{}}
        onPlay={playPlayback}
        onPause={pausePlayback}
        onNext={nextTrack}
        onPrevious={previousTrack}
      />
    </>
  );
}
