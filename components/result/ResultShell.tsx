"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import screen from "@/components/layout/screen.module.css";
import { CouponBlock } from "@/components/receipt/CouponBlock";
import { Dash } from "@/components/receipt/Dash";
import { Paper } from "@/components/receipt/Paper";
import { Scissors } from "@/components/receipt/Scissors";
import { Slot } from "@/components/receipt/Slot";
import receiptStyles from "@/components/receipt/receipt.module.css";
import { EVENT, SITE } from "@/config/site";
import { couponStateFor, isEventOver } from "@/lib/coupon";
import { drawAgain, syncCoupon } from "@/lib/draw-actions";
import type { KoreanName } from "@/lib/names";
import { rememberSource } from "@/lib/storage";
import { formatSeoulTime } from "@/lib/time";
import { useDrawRecord } from "@/lib/use-draw";
import styles from "./result.module.css";

type ResultShellProps = {
  name: KoreanName;
  title: string; // h1
  card: React.ReactNode; // 신문 카드 (정적 HTML)
  receipt: React.ReactNode; // 이름 영수증 본문 (정적 HTML)
  visitor: React.ReactNode; // 링크로 온 사람에게 보이는 아래쪽 (정적 HTML)
};

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="8" fill="#FFFFFF" />
      <path d="M4.5 8.2l2.3 2.3 4.7-4.9" fill="none" stroke="#2D46F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// /names/[id]: 이 이름을 뽑은 사람이면 결과(F3), 아니면 이름 페이지(SPEC §3-8)
export function ResultShell({ name, title, card, receipt, visitor }: ResultShellProps) {
  const router = useRouter();
  const record = useDrawRecord();
  // 다시 뽑기로 주소가 바뀌는 동안 이 화면을 결과 모드로 유지한다
  const [leaving, setLeaving] = useState(false);
  const isMine = leaving || record?.nameId === name.id;

  useEffect(() => {
    rememberSource(window.location.search);
  }, []);

  // 시트 전달이 안 된 쿠폰은 다시 보낸다 (서버에서 같은 코드는 한 번만 기록)
  useEffect(() => {
    if (record && !record.sent) syncCoupon(record);
  }, [record]);

  const over = isEventOver();

  const tryAgain = () => {
    if (!record) return;
    setLeaving(true);
    const next = drawAgain(record);
    router.replace(`/names/${next.nameId}`);
  };

  return (
    <>
      {isMine && record ? (
        <div className={styles.printed}>
          <div className={styles.printedLabel}>
            <CheckIcon />
            PRINTED!
          </div>
          <div className={styles.printedMeta}>{formatSeoulTime(new Date(record.issuedAt))}</div>
        </div>
      ) : null}
      <h1 className={isMine ? screen.srOnly : styles.title}>{title}</h1>

      <div className={screen.stage}>
        <Slot width={324} />
        <Paper
          width={300}
          top={
            <>
              <div className={receiptStyles.cardTop}>{card}</div>
              <Scissors />
            </>
          }
        >
          {receipt}
          {isMine && record ? (
            <>
              <Dash />
              <CouponBlock state={couponStateFor(record.code)} />
            </>
          ) : null}
          <div className={styles.thanks}>감사합니다! Thank you!</div>
        </Paper>
      </div>

      {isMine && record ? (
        <div className={styles.actions}>
          {/* TODO(§14 5단계): SHARE TO MY STORY · SAVE IMAGE */}
          <a
            className={`${screen.button} ${screen.buttonWhite}`}
            href={over ? EVENT.instagram : EVENT.mapUrl}
            target="_blank"
            rel="noopener"
          >
            {over ? "FOLLOW US ↗" : "DIRECTIONS ↗"}
          </a>
          <div className={screen.links}>
            {!over && (
              <a className={screen.linkButton} href={EVENT.instagram} target="_blank" rel="noopener">
                Follow {SITE.instagramHandle}
              </a>
            )}
            {!record.redrawn && (
              <button type="button" className={screen.linkButton} onClick={tryAgain}>
                Try once more
              </button>
            )}
          </div>
        </div>
      ) : (
        visitor
      )}
    </>
  );
}
