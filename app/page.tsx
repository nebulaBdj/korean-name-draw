import type { Metadata } from "next";
import { DrawStage } from "@/components/draw/DrawStage";
import { Header } from "@/components/layout/Header";
import screen from "@/components/layout/screen.module.css";
import { Barcode } from "@/components/receipt/Barcode";
import { Dash } from "@/components/receipt/Dash";
import { Leader } from "@/components/receipt/Leader";
import { Paper } from "@/components/receipt/Paper";
import { Slot } from "@/components/receipt/Slot";
import { EVENT } from "@/config/site";
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

function FreeSticker() {
  return (
    <div className={styles.sticker} aria-hidden="true">
      <div className={styles.stickerMain}>FREE</div>
      <div className={styles.stickerSub}>10 sec</div>
    </div>
  );
}

// 아직 이름이 인쇄되지 않은 빈 영수증: 무엇을 받는지만 보여준다
function EmptyReceipt() {
  return (
    <div className={styles.stage}>
      <Slot width={320} />
      <Paper width={292} overlay={<FreeSticker />}>
        <div className={styles.storeName}>YOLK MART 24</div>
        <div className={styles.center}>Seongsu pop-up</div>
        <Dash />
        <Leader label="Korean name" value="1" />
        <Leader label="Newspaper card" value="1" />
        <Leader label="Booth coupon" value="1" />
        <Dash />
        <Leader label="TOTAL" value="₩0 FREE" fontSize={14} strong />
        <Dash />
        <Barcode />
        <div className={styles.center} style={{ marginTop: 6 }}>
          감사합니다! Thank you!
        </div>
      </Paper>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className={screen.screen}>
      <Header />
      <DrawStage
        intro={
          <>
            <h1 className={styles.title}>
              What&apos;s your
              <br />
              Korean name?
            </h1>
            <p className={styles.subtitle}>Get a free Korean name made from native Korean words.</p>
          </>
        }
        receipt={<EmptyReceipt />}
      />
      <div className={styles.eventLine}>
        {EVENT.dates} · {EVENT.venue} · {EVENT.hours}
      </div>
    </main>
  );
}
