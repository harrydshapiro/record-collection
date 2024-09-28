import React from "react";
import styles from "./Button.module.scss";
import clsx from "clsx";

type ButtonPorps = {
  onClick?: () => void | Promise<void>;
  className?: string;
  text: string;
};

export function Button({
  onClick = () => {},
  text,
  className,
}: ButtonPorps): JSX.Element {
  return (
    <button onClick={onClick} className={clsx(styles.button, className)}>
      {text}
    </button>
  );
}
