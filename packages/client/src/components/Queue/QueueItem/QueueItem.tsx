import React from "react";
import { PlayerContextState } from "../../../state/player.context";
import styles from "./QueueItem.module.scss";
import { AlbumCover } from "../../AlbumCover/AlbumCover";

type onItemSelectFn = (position: number) => void | Promise<void>;

type QueueItemProps = {
  queueItemInfo: PlayerContextState["queue"]["fullQueue"][0];
  onItemSelect: onItemSelectFn;
  isSelected: boolean;
};

export function QueueItem({
  queueItemInfo,
  onItemSelect,
  isSelected,
}: QueueItemProps): JSX.Element {
  return (
    <div
      className={styles.queueItem}
      onClick={() => onItemSelect(queueItemInfo.id!)}
    >
      <input type="checkbox" checked={isSelected} readOnly={true} />
      <div>
        <AlbumCover
          // TODO: Figure out if we need this album ID
          albumName={queueItemInfo.album!}
          artistName={queueItemInfo.artist || queueItemInfo.albumArtist!}
          trackName={queueItemInfo.title}
        />
      </div>
    </div>
  );
}
