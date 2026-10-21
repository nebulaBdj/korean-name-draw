import type { Metadata } from "next";
import { Barcode } from "@/components/receipt/Barcode";
import { Dash } from "@/components/receipt/Dash";
import { ItemRow } from "@/components/receipt/ItemRow";
import { Leader } from "@/components/receipt/Leader";
import { NowStamp } from "@/components/receipt/NowStamp";
import { Paper } from "@/components/receipt/Paper";
import { Slot } from "@/components/receipt/Slot";
import { EVENT, SITE } from "@/config/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    title: "What's Your Korean Name? Korean Name Generator | Seoul Yolk",
    description:
      "Draw a Korean name made from native Korean words. See what it means, how to write it in Hangul and how to say it — free, in 10 seconds.",
  },
};

const PAPER_WIDTH = 292;

function OnePlusOneSticker() {
  return (
    <div className={styles.sticker} aria-hidden="true">
      <div className={styles.stickerMain}>1+1</div>
      <div className={styles.stickerSub}>name+paper</div>
    </div>
  );
}

// 아직 이름이 인쇄되지 않은 빈 영수증
function EmptyReceipt() {
  return (
    <Paper width={PAPER_WIDTH} overlay={<OnePlusOneSticker />}>
      <div className={styles.center} style={{ fontWeight: 700, fontSize: 16, letterSpacing: "0.08em" }}>
        YOLK MART 24
      </div>
      <div className={styles.center}>성수 팝업점 · Seongsu pop-up</div>
      <div className={styles.center} style={{ color: "var(--ink-sub)" }}>
        <NowStamp initialIso={EVENT.startsAt} />
      </div>
      <Dash />
      <ItemRow tone="sub" label="품목 ITEM" value="수량 QTY" />
      <ItemRow label="한국 이름 Korean name" value="1" />
      <ItemRow label="신문 카드 Newspaper card" value="1+1" />
      <ItemRow label="부스 할인 쿠폰 Booth coupon" value="1" />
      <Dash />
      <Leader label="이름 NAME" value="? ?" />
      <Leader label="뜻 MEANING" value="???" />
      <Dash />
      <Leader label="합계 TOTAL" value="₩0 FREE" fontSize={14} strong />
      <Dash />
      <Barcode />
      <div className={styles.center} style={{ marginTop: 6 }}>
        감사합니다! Thank you!
      </div>
    </Paper>
  );
}

export default function LandingPage() {
  return (
    <main className={styles.screen}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.logo} aria-hidden="true" />
          YOLK MART 24
        </div>
        <a className={styles.handle} href={EVENT.instagram} target="_blank" rel="noopener">
          {SITE.instagramHandle}
        </a>
      </header>

      <h1 className={styles.title}>
        What&apos;s your
        <br />
        Korean name?
      </h1>
      <p className={styles.subtitle}>Print a free Korean name, Seoul convenience-store style.</p>

      <div className={styles.stage}>
        <Slot width={320} />
        <EmptyReceipt />
      </div>

      {/* TODO(§14 3단계): 누르면 인쇄 연출(F2) → /names/[id] */}
      <button type="button" className={styles.printButton}>
        PRINT MY NAME →
      </button>
      <div className={styles.eventLine}>
        {EVENT.dates} · {EVENT.venue} · {EVENT.hours}
      </div>
      <div className={styles.note}>Free · takes 10 seconds</div>
    </main>
  );
}
