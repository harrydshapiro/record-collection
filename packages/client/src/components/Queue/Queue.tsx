import React, { useEffect, useState } from "react";
import styles from "./Queue.module.scss";
import { PlayerContextState } from "../../state/player.context";
import { removeItemsFromQueue } from "../../api/client";
import { QueueControls } from "./QueueControls/QueueControls";
import { QueueItem } from "./QueueItem/QueueItem";

type QueueProps = {
  currentQueue: PlayerContextState["queue"];
};

export function Queue({ currentQueue }: QueueProps): JSX.Element {
  const [selectedQueueItemIds, setSelectedQueueItemIds] = useState<
    Array<number>
  >([]);

  const toggleItemSelection = (index: number) => {
    if (!selectedQueueItemIds.includes(index)) {
      setSelectedQueueItemIds([...selectedQueueItemIds, index]);
    } else {
      setSelectedQueueItemIds(selectedQueueItemIds.filter((i) => i !== index));
    }
  };

  const removeSelectedQueueItems = async () => {
    if (selectedQueueItemIds.length === 0) {
      return;
    }
    await removeItemsFromQueue(selectedQueueItemIds);
  };

  // Ensures that queue items do not remain selected in the component's local state after they are
  // removed from the MPD queue. Could be removed by user action w/ this component, or could be
  // removed by some other process entirely (thats why we react to currentQueue.fullQueue instead of
  // running this code in removeSelectedQueueItems).
  useEffect(() => {
    const currentQueueIds = currentQueue.fullQueue.map(({ id }) => id);
    const validSelectedQueueItemIds = selectedQueueItemIds.filter(
      (id) => typeof id === "number" && currentQueueIds.includes(id),
    );
    setSelectedQueueItemIds(validSelectedQueueItemIds);
  }, [currentQueue.fullQueue]);

  const toggleSelectAll = () => {
    // If every item is already selected, deselects them all
    // Subtracing 1 here because we don't want to select the currently playing song in the queue
    if (selectedQueueItemIds.length === currentQueue.fullQueue.length - 1) {
      setSelectedQueueItemIds([]);
      return;
    }
    setSelectedQueueItemIds(
      currentQueue.fullQueue
        .filter((_, i) => i !== currentQueue.currentIndex)
        .map((item) => item.id!),
    );
  };

  return (
    <div className={styles.QueueContainer}>
      <QueueControls
        onRemove={removeSelectedQueueItems}
        onSelectAll={toggleSelectAll}
      />
      {currentQueue.fullQueue
        .slice((currentQueue.currentIndex || 0) + 1)
        .map((queueItem, index) => (
          <QueueItem
            queueItemInfo={queueItem}
            isSelected={
              typeof queueItem.id === "number"
                ? selectedQueueItemIds.includes(queueItem.id)
                : false
            }
            onItemSelect={toggleItemSelection}
            key={index}
          />
        ))}
    </div>
  );
}
