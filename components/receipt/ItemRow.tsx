import styles from "./receipt.module.css";

type ItemRowProps = {
  label: React.ReactNode;
  value: React.ReactNode;
  tone?: "strong" | "sub";
};

// 품목 줄: 왼쪽 품목, 오른쪽 수량
export function ItemRow({ label, value, tone = "strong" }: ItemRowProps) {
  return (
    <div className={`${styles.row} ${styles[tone]}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
