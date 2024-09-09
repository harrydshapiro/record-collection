import React, { useState } from "react";
import styles from "./Queue.module.scss";
import { PlayerContextState } from "../../state/player.context";
import { AlbumCover } from "../AlbumCover/AlbumCover";

type onItemSelectFn = (position: number) => void | Promise<void>;

type QueueProps = {
  currentQueue: PlayerContextState["queue"];
};

type QueueItemProps = {
  queueItemInfo: PlayerContextState["queue"]["fullQueue"][0];
  onItemSelect: onItemSelectFn;
  isSelected: boolean;
};

function QueueItem({
  queueItemInfo,
  onItemSelect,
  isSelected,
}: QueueItemProps): JSX.Element {
  return (
    <div className={styles.queueItem}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onItemSelect(queueItemInfo.position!)}
      />
      <div>
        <AlbumCover
          // TODO: Figure out if we need this album ID
          albumId={""}
          albumName={queueItemInfo.album!}
          artistName={queueItemInfo.albumArtist!}
          trackName={queueItemInfo.title}
        />
      </div>
    </div>
  );
}

export function Queue({ currentQueue }: QueueProps): JSX.Element {
  const [selectedQueueItemIndices, setSelectedQueueItemIndices] = useState<
    Array<number>
  >([]);

  const toggleItemSelection = (index: number) => {
    if (!selectedQueueItemIndices.includes(index)) {
      setSelectedQueueItemIndices([...selectedQueueItemIndices, index]);
    } else {
      setSelectedQueueItemIndices(
        selectedQueueItemIndices.filter((i) => i !== index),
      );
    }
  };

  return (
    <div className={styles.QueueContainer}>
      {currentQueue.fullQueue
        .slice(1, currentQueue.fullQueue.length)
        .map((queueItem, index) => (
          <QueueItem
            queueItemInfo={queueItem}
            isSelected={
              typeof queueItem.position === "number"
                ? selectedQueueItemIndices.includes(queueItem.position)
                : false
            }
            onItemSelect={toggleItemSelection}
            key={index}
          />
        ))}
    </div>
  );
}
