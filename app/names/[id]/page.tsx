import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import screen from "@/components/layout/screen.module.css";
import { ScaledNameCard } from "@/components/name-card/NameCard";
import { NameReceipt } from "@/components/receipt/NameReceipt";
import { ResultShell } from "@/components/result/ResultShell";
import styles from "@/components/result/result.module.css";
import { SITE } from "@/config/site";
import { getName, names, toTitleRoman, type KoreanName } from "@/lib/names";

type Params = { params: Promise<{ id: string }> };

export const dynamicParams = false; // 없는 이름 id는 404

export function generateStaticParams() {
  return names.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const name = getName((await params).id);
  if (!name) return {};
  const roman = toTitleRoman(name.roman);
  const title = `${roman} (${name.hangul}) — Korean Name Meaning “${name.meaning}”`;
  const description = `${name.hangul} (${roman}) is a native Korean name meaning “${name.meaning}”. See how to write it in Hangul and how to say it, then draw your own.`;
  const path = `/names/${name.id}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { url: path, title: `${title} | Seoul Yolk`, description },
  };
}

// 같은 태그를 가진 다른 이름. 모자라면 목록 순서대로 채운다
function similarNames(name: KoreanName, count: number): KoreanName[] {
  const others = names.filter((other) => other.id !== name.id);
  const sameTag = others.filter((other) => other.tags.some((tag) => name.tags.includes(tag)));
  const rest = others.filter((other) => !sameTag.includes(other));
  return [...sameTag, ...rest].slice(0, count);
}

export default async function NamePage({ params }: Params) {
  const name = getName((await params).id);
  if (!name) notFound();
  const roman = toTitleRoman(name.roman);
  // Home › Names › Garam (SPEC §16-4)
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Names", item: `${SITE.url}/names` },
      { "@type": "ListItem", position: 3, name: roman, item: `${SITE.url}/names/${name.id}` },
    ],
  };

  return (
    <main className={screen.screen}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Header />
      <ResultShell
        name={name}
        title={`${name.hangul} (${roman}) — Korean name meaning “${name.meaning}”`}
        card={<ScaledNameCard hangul={name.hangul} roman={name.roman} meaning={name.meaning} message={name.message} />}
        receipt={<NameReceipt name={name} />}
        visitor={
          <div className={styles.actions}>
            <Link className={`${screen.button} ${screen.buttonWhite}`} href="/">
              PRINT MY OWN NAME →
            </Link>
            <section className={styles.more}>
              <h2 className={styles.moreTitle}>More names like this</h2>
              <ul className={styles.moreList}>
                {similarNames(name, 4).map((other) => (
                  <li key={other.id}>
                    <Link className={styles.moreItem} href={`/names/${other.id}`}>
                      <span lang="ko">{other.hangul}</span> · {toTitleRoman(other.roman)}
                      <span className={styles.moreMeaning}>{other.meaning}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link className={styles.allLink} href="/names">
                See all {names.length} names →
              </Link>
            </section>
          </div>
        }
      />
    </main>
  );
}
