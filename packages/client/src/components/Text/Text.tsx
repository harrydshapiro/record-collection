import styles from "./Text.module.scss";

export function Text({ content, style }: { content: string; style: "body" }) {
  return <span className={styles[`text-style-${style}`]}>{content}</span>;
}
