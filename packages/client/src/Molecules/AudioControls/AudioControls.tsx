import styles from "./AudioControls.module.scss";

export type AudioControlsProps = {
  playHandler: () => void;
  pauseHandler: () => void;
  previousHandler: () => void;
  nextHandler: () => void;
  currentlyPlaying: {
    songTitle: string;
    albumTitle: string;
    artistTitle: string;
  };
};

export function AudioControls(props: AudioControlsProps) {
  console.log(props);
  return <div className={styles.audioControlsContainer}></div>;
}
