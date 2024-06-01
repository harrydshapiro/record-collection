import {
  AudioControls,
  AudioControlsProps,
} from "../../Molecules/AudioControls/AudioControls";

export function PlayableQueue({
  audioControlsProps,
}: {
  audioControlsProps: AudioControlsProps;
}) {
  return (
    <>
      <AudioControls {...audioControlsProps} />
    </>
  );
}
