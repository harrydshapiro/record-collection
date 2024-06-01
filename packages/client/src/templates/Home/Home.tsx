import { useEffect } from "react";
import {
  getCurrentQueueState,
  pausePlayback,
  playPlayback,
} from "../../api/client";
import { PlayableQueue } from "../../Organisms/PlayableQueue/PlayableQueue";
import { TileGallery } from "../../Organisms/TileGallery/TileGallery";

export function HomeTemplate() {
  useEffect(() => {
    getCurrentQueueState()
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  return (
    <>
      <PlayableQueue
        audioControlsProps={{
          playHandler: playPlayback,
          pauseHandler: pausePlayback,
          nextHandler: () => {},
          previousHandler: () => {},
          currentlyPlaying: {
            songTitle: "string",
            albumTitle: "string",
            artistTitle: "string",
          },
        }}
      />
      <TileGallery tiles={[]} />
    </>
  );
}
