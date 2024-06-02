import { GetAlbumsReturnType } from "@songhaus/server";
import { pausePlayback, playPlayback } from "../../api/client";
import { PlayableQueue } from "../../Organisms/PlayableQueue/PlayableQueue";
import { TileGallery } from "../../Organisms/TileGallery/TileGallery";

export function HomeTemplate({
  albumData,
}: {
  albumData: GetAlbumsReturnType;
}) {
  const tiles = 
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
      <TileGallery tiles={albums} />
    </>
  );
}
