import { nanumGothicCoding } from "@/lib/fonts";
import styles from "./receipt.module.css";
import { Zigzag } from "./Zigzag";

type PaperProps = {
  width: number;
  children: React.ReactNode;
  // 종이 위에 겹치는 장식(스티커 등)
  overlay?: React.ReactNode;
  // 신문 카드처럼 영수증 본문 위에 붙는 부분
  top?: React.ReactNode;
  className?: string;
};

// 슬롯에서 나온 영수증 종이: (위 부분) + 흰 본문 + 톱니 끝
export function Paper({ width, children, overlay, top, className = "" }: PaperProps) {
  return (
    <div className={`${styles.paper} ${className}`} style={{ width }}>
      {top}
      <div className={`${styles.body} ${top ? styles.bodyAfterTop : ""} ${nanumGothicCoding.className}`}>{children}</div>
      <Zigzag width={width} />
      {overlay}
    </div>
  );
}
