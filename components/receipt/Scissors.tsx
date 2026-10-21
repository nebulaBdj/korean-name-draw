import styles from "./receipt.module.css";

// 신문 카드와 영수증 사이 가위 점선
export function Scissors() {
  return (
    <div className={styles.scissors}>
      <div className={styles.scissorsLine} />
      <svg className={styles.scissorsIcon} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <rect width="16" height="16" fill="#FFFFFF" />
        <circle cx="3.5" cy="4" r="2.4" fill="none" stroke="#7A8299" strokeWidth="1.4" />
        <circle cx="3.5" cy="12" r="2.4" fill="none" stroke="#7A8299" strokeWidth="1.4" />
        <path d="M5.5 5.3L15 11.5M5.5 10.7L15 4.5" stroke="#7A8299" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </div>
  );
}
