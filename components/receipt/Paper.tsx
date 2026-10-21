import { nanumGothicCoding } from "@/lib/fonts";
import styles from "./receipt.module.css";
import { Zigzag } from "./Zigzag";

type PaperProps = {
  width: number;
  children: React.ReactNode;
  // 종이 위에 겹치는 장식(1+1 스티커 등)
  overlay?: React.ReactNode;
};

// 슬롯에서 나온 영수증 종이: 흰 본문 + 톱니 끝
export function Paper({ width, children, overlay }: PaperProps) {
  return (
    <div className={styles.paper} style={{ width }}>
      <div className={`${styles.body} ${nanumGothicCoding.className}`}>{children}</div>
      <Zigzag width={width} />
      {overlay}
    </div>
  );
}
