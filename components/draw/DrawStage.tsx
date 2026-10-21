"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CouponBlock } from "@/components/receipt/CouponBlock";
import { Dash } from "@/components/receipt/Dash";
import { NameReceipt } from "@/components/receipt/NameReceipt";
import { Paper } from "@/components/receipt/Paper";
import { Scissors } from "@/components/receipt/Scissors";
import { Slot } from "@/components/receipt/Slot";
import screen from "@/components/layout/screen.module.css";
import { track } from "@/lib/analytics";
import { couponStateFor } from "@/lib/coupon";
import { drawFirst } from "@/lib/draw-actions";
import { getName, type KoreanName } from "@/lib/names";
import { rememberSource, type DrawRecord } from "@/lib/storage";
import { useDrawRecord } from "@/lib/use-draw";
import styles from "./draw.module.css";

type DrawStageProps = {
  // 정적 HTML에 들어가는 랜딩 제목·빈 영수증
  intro: React.ReactNode;
  receipt: React.ReactNode;
};

type Printing = { name: KoreanName; record: DrawRecord };

const resultPath = (nameId: string) => `/names/${nameId}`;

// 랜딩의 뽑기 부분: PRINT MY NAME → 인쇄 연출(약 1.6초) → /names/[id]
export function DrawStage({ intro, receipt }: DrawStageProps) {
  const router = useRouter();
  const existing = useDrawRecord();
  const [printing, setPrinting] = useState<Printing | null>(null);

  useEffect(() => {
    rememberSource(window.location.search);
  }, []);

  const goToResult = (nameId: string) => router.push(resultPath(nameId));

  // animationend가 오지 않는 경우(탭 전환 등)에도 결과로 넘어간다
  useEffect(() => {
    if (!printing) return;
    const timer = setTimeout(() => router.push(resultPath(printing.name.id)), 2500);
    return () => clearTimeout(timer);
  }, [printing, router]);

  const print = () => {
    track("draw_start");
    const record = drawFirst();
    track("draw_complete", { name_id: record.nameId, coupon_code: record.code || "none", is_redraw: false });
    const name = getName(record.nameId);
    if (!name) return;
    router.prefetch(resultPath(name.id));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      goToResult(name.id);
      return;
    }
    setPrinting({ name, record });
  };

  if (printing) {
    return (
      <>
        <div className={screen.title} role="status">
          Printing your
          <br />
          Korean name…
        </div>
        <div className={styles.printing}>
          <span className={styles.blink} />
          PRINTING…
        </div>
        <div className={screen.stage} style={{ flex: "1 1 auto", minHeight: 0 }}>
          <Slot width={324} />
          <div className={styles.feedWindow}>
            <div className={styles.feed} style={{ width: 300 }} onAnimationEnd={() => goToResult(printing.name.id)}>
              <Paper width={300} top={<><div className={styles.blank} /><Scissors /></>}>
                <NameReceipt name={printing.name} />
                <Dash />
                <CouponBlock state={couponStateFor(printing.record.code)} />
                <div style={{ textAlign: "center", marginTop: 6 }}>감사합니다! Thank you!</div>
              </Paper>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {intro}
      {receipt}
      {existing ? (
        <button type="button" className={`${screen.button} ${screen.buttonDark}`} onClick={() => goToResult(existing.nameId)}>
          SEE MY NAME →
        </button>
      ) : (
        <button type="button" className={`${screen.button} ${screen.buttonDark}`} style={{ height: 58, fontSize: 16 }} onClick={print}>
          PRINT MY NAME →
        </button>
      )}
    </>
  );
}
