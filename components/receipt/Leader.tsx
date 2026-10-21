import styles from "./receipt.module.css";

type LeaderProps = {
  label: React.ReactNode;
  value: React.ReactNode;
  fontSize?: number;
  strong?: boolean;
};

// 항목 ······ 값 (점 리더 줄)
export function Leader({ label, value, fontSize, strong = false }: LeaderProps) {
  return (
    <div className={`${styles.leader} ${strong ? styles.strong : ""}`} style={{ fontSize }}>
      <span>{label}</span>
      <span className={styles.leaderLine} />
      <span className={styles.strong}>{value}</span>
    </div>
  );
}
