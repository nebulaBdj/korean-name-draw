import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import screen from "@/components/layout/screen.module.css";
import { nanumGothicCoding } from "@/lib/fonts";
import { names, toTitleRoman } from "@/lib/names";
import styles from "./names.module.css";

const title = `Native Korean Names and Meanings (${names.length} Names)`;
const description = `All ${names.length} native Korean names in our draw, with Hangul, romanization and meaning.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/names" },
  openGraph: { url: "/names", title: `${title} | Seoul Yolk`, description },
};

export default function NamesPage() {
  return (
    <main className={screen.screen}>
      <Header />
      <h1 className={styles.title}>Native Korean names and meanings</h1>
      <p className={styles.intro}>
        Native Korean names (순우리말) come from everyday Korean words, not Chinese characters. Here are all {names.length} names
        in our draw.
      </p>
      <ul className={`${styles.grid} ${nanumGothicCoding.className}`}>
        {names.map((name) => (
          <li key={name.id}>
            <Link className={styles.card} href={`/names/${name.id}`}>
              <div className={styles.hangul} lang="ko">
                {name.hangul}
              </div>
              <div className={styles.roman}>{toTitleRoman(name.roman)}</div>
              <div className={styles.meaning}>{name.meaning}</div>
            </Link>
          </li>
        ))}
      </ul>
      <Link className={`${screen.button} ${screen.buttonDark}`} href="/" style={{ marginTop: 8 }}>
        PRINT MY NAME →
      </Link>
    </main>
  );
}
