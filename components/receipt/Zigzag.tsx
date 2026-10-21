import styles from "./receipt.module.css";

const TEETH = 24;
const HEIGHT = 9;

// 종이 아래 톱니 끝: 폭을 TEETH개 삼각형으로 나눈 경로
function zigzagPath(width: number): string {
  const step = width / (TEETH * 2);
  const points = Array.from({ length: TEETH * 2 + 1 }, (_, i) => `L${(i * step).toFixed(2)} ${i % 2 === 1 ? HEIGHT : 0}`);
  return `M0 0 ${points.slice(1).join(" ")} Z`;
}

export function Zigzag({ width }: { width: number }) {
  return (
    <svg className={styles.zigzag} width={width} height={HEIGHT} viewBox={`0 0 ${width} ${HEIGHT}`} aria-hidden="true">
      <path d={zigzagPath(width)} fill="#FFFFFF" />
    </svg>
  );
}
