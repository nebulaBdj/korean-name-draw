import styles from "./receipt.module.css";

// 영수증 프린터 슬롯
export function Slot({ width }: { width: number }) {
  return <div className={styles.slot} style={{ width }} />;
}
