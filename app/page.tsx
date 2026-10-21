import type { Metadata } from "next";
import { DrawStage } from "@/components/draw/DrawStage";
import { Header } from "@/components/layout/Header";
import screen from "@/components/layout/screen.module.css";
import { Barcode } from "@/components/receipt/Barcode";
import { Dash } from "@/components/receipt/Dash";
import { Leader } from "@/components/receipt/Leader";
import { Paper } from "@/components/receipt/Paper";
import { Slot } from "@/components/receipt/Slot";
import { DuringEvent, EventLine } from "@/components/layout/EventLine";
import { SITE } from "@/config/site";
import { names } from "@/lib/names";
import Link from "next/link";
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
      <div className={styles.stickerSub}>no sign-up</div>
    </div>
  );
}

// 받는 것 한 줄 + 무엇인지 설명 한 줄
function Item({ label, note }: { label: string; note: string }) {
  return (
    <>
      <Leader label={label} value="1" strong />
      <div className={styles.itemNote}>{note}</div>
    </>
  );
}

// 아직 이름이 인쇄되지 않은 빈 영수증: 무엇을 받는지 보여준다
function EmptyReceipt() {
  return (
    <div className={styles.stage}>
      <Slot width={320} />
      <Paper width={292} overlay={<FreeSticker />}>
        <div className={styles.storeName}>YOLK MART 24</div>
        <div className={styles.center}>Seongsu pop-up</div>
        <Dash />
        <Item label="Korean name" note="+ meaning & how to say it" />
        <Item label="Newspaper card" note="+ image for your IG story" />
        <DuringEvent>
          <Item label="Booth coupon" note="discount on a real newspaper photo" />
        </DuringEvent>
        <Dash />
        <Leader label="TOTAL" value="₩0 FREE" fontSize={14} strong />
        <Dash />
        <Barcode height={32} />
        <div className={styles.center} style={{ marginTop: 6 }}>
          감사합니다! Thank you!
        </div>
      </Paper>
    </div>
  );
}

export default function LandingPage() {
  return (
    <>
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
            <p className={styles.subtitle}>
              Get a free Korean name
              <br />
              made from native Korean words.
            </p>
          </>
        }
        receipt={<EmptyReceipt />}
      />
      <EventLine className={styles.eventLine} />
    </main>
    <AboutSection />
    </>
  );
}

// 사이트 이름 (검색 결과 표시용, SPEC §16-4)
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
};

// 검색엔진이 읽는 본문. 같은 영수증 스타일로 첫 화면 아래에 둔다
function AboutSection() {
  return (
    <section className={styles.about}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <Paper width={292}>
        <div className={styles.aboutBody}>
          <h2>What&apos;s a native Korean name?</h2>
          <p>
            Native Korean names (순우리말) come from everyday Korean words, not Chinese characters. 하늘 (Haneul) means
            “sky” and 가람 (Garam) means “river”.
          </p>
          <Dash />
          <h2>How it works</h2>
          <ol>
            <li>Print your name</li>
            <li>Learn how to write and say it</li>
            <li>Share it</li>
            <DuringEvent>
              <li>Get it printed in a real newspaper photo at our pop-up</li>
            </DuringEvent>
          </ol>
          <Dash />
          <h2>FAQ</h2>
          <h3>Is it free?</h3>
          <p>Yes. It takes about 10 seconds.</p>
          <h3>How do I say my name?</h3>
          <p>Tap ▶ to hear it in Korean. Your result also shows how the Hangul letters combine.</p>
          <h3>Can I use it as my Korean name?</h3>
          <p>Yes. Every name is a real Korean word that also works as a given name or nickname.</p>
          <h3>How many names are there?</h3>
          <p>
            {names.length} native Korean names. <Link href="/names">See all {names.length} names →</Link>
          </p>
        </div>
      </Paper>
    </section>
  );
}
