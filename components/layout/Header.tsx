import Link from "next/link";
import { EVENT, SITE } from "@/config/site";
import styles from "./screen.module.css";

// 머리줄: 노른자 로고 + YOLK MART 24, 오른쪽 @seoul.yolk
export function Header() {
  return (
    <header className={styles.header}>
      <Link className={styles.brand} href="/">
        <span className={styles.logo} aria-hidden="true" />
        YOLK MART 24
      </Link>
      <a className={styles.handle} href={EVENT.instagram} target="_blank" rel="noopener">
        {SITE.instagramHandle}
      </a>
    </header>
  );
}
