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
import { track } from "@/lib/analytics";
import { couponStateFor, isEventOver } from "@/lib/coupon";
import { drawAgain, syncCoupon } from "@/lib/draw-actions";
import type { KoreanName } from "@/lib/names";
import { rememberSource } from "@/lib/storage";
import { formatSeoulTime } from "@/lib/time";
import { isInAppBrowser } from "@/lib/story-image";
import { useDrawRecord } from "@/lib/use-draw";
import styles from "./result.module.css";
import { StoryFallback } from "./StoryFallback";
import { useStoryImage } from "./use-story-image";

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
  const story = useStoryImage(name, isMine);
  const [view, setView] = useState<"result" | "fallback">("result");
  const [sharing, setSharing] = useState(false);

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

  // SHARE TO MY STORY · SAVE IMAGE: 공유 시트(저장 포함), 안 되면 길게 눌러 저장 화면 (SPEC §3-4, §6)
  const shareStory = async () => {
    const file = story ? new File([story.blob], "my-korean-name.png", { type: "image/png" }) : null;
    if (!file || isInAppBrowser() || !navigator.canShare?.({ files: [file] })) {
      setView("fallback");
      track("card_save", { method: "longpress" });
      return;
    }
    setSharing(true);
    try {
      await navigator.share({ files: [file] });
      track("card_save", { method: "share" });
    } catch {
      // 사용자가 닫음
    } finally {
      setSharing(false);
    }
  };

  if (isMine && view === "fallback") {
    return <StoryFallback imageUrl={story?.url ?? null} inApp={isInAppBrowser()} onBack={() => setView("result")} />;
  }

  return (
    <>
      {sharing && (
        <div className={styles.shareOverlay} aria-live="polite">
          <div className={styles.bubble}>
            Tap Instagram → Stories,
            <br />
            then tag {SITE.instagramHandle}
          </div>
        </div>
      )}
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
          <button type="button" className={`${screen.button} ${screen.buttonWhite}`} onClick={shareStory}>
            SHARE TO MY STORY
          </button>
          <div className={styles.pair}>
            <button type="button" className={`${screen.button} ${screen.buttonOutline}`} onClick={shareStory}>
              SAVE IMAGE
            </button>
            <a
              className={`${screen.button} ${screen.buttonOutline}`}
              href={over ? EVENT.instagram : EVENT.mapUrl}
              target="_blank"
              rel="noopener"
              onClick={() => track(over ? "instagram_click" : "booth_map_click")}
            >
              {over ? "FOLLOW US ↗" : "DIRECTIONS ↗"}
            </a>
          </div>
          <div className={screen.links}>
            {!over && (
              <a
                className={screen.linkButton}
                href={EVENT.instagram}
                target="_blank"
                rel="noopener"
                onClick={() => track("instagram_click")}
              >
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
