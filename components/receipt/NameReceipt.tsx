import type { KoreanName } from "@/lib/names";
import { Dash } from "./Dash";
import { ItemRow } from "./ItemRow";
import { JamoTiles } from "./JamoTiles";
import { Leader } from "./Leader";
import { SayIt } from "./SayIt";
import styles from "./receipt.module.css";

// 이름 영수증 본문: 품목 → 읽는 법 → 발음 → 합계 (결과·이름 페이지·인쇄 연출 공용)
export function NameReceipt({ name }: { name: KoreanName }) {
  return (
    <>
      <ItemRow tone="sub" label="품목 ITEM" value="수량 QTY" />
      <ItemRow label={`${name.hangul} · ${name.roman} (${name.meaning})`} value="1" big />
      <ItemRow label="신문 카드 Newspaper card" value="1" />
      <Dash />
      <div className={styles.sub}>읽는 법 HOW TO READ</div>
      <JamoTiles hangul={name.hangul} />
      <div className={styles.sayIt}>
        <span>발음 SAY IT</span>
        <span className={styles.sayItLine} />
        <span className={styles.strong}>{name.soundsLike ?? name.roman}</span>
        <SayIt hangul={name.hangul} nameId={name.id} />
      </div>
      <Dash />
      <Leader label="합계 TOTAL" value="₩0 FREE" fontSize={14} strong />
    </>
  );
}
