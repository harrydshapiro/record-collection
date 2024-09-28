import React from "react";
import { Button } from "../../Button/Button";
import styles from "./QueueControls.module.scss";

type QueueControlsProps = {
  onRemove: () => Promise<void>;
  onSelectAll: () => void;
};

export function QueueControls({
  onRemove,
  onSelectAll,
}: QueueControlsProps): JSX.Element {
  return (
    <div className={styles.queueControls}>
      <Button
        onClick={onSelectAll}
        text={"Select All"}
        className={styles.selectButton}
      />
      |
      <Button
        onClick={onRemove}
        text={"Remove"}
        className={styles.removeButton}
      />
    </div>
  );
}
