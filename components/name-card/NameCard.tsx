import { EVENT } from "@/config/site";
import { anton, blackHanSans, ibmPlexSansKr } from "@/lib/fonts";
import styles from "./NameCard.module.css";

type NameCardProps = {
  hangul: string;
  roman: string;
  meaning: string;
  message?: string;
  blank?: boolean; // 이름 칸을 비운 템플릿 (스토리 이미지용 PNG를 만들 때)
};

function Burst({ color, flip = false }: { color: string; flip?: boolean }) {
  return (
    <svg width="18" height="30" viewBox="0 0 18 30" aria-hidden="true">
      <g stroke={color} strokeWidth="3" strokeLinecap="round">
        {flip ? (
          <>
            <path d="M10 2L3 8" />
            <path d="M16 15H5" />
            <path d="M10 28l-7-6" />
          </>
        ) : (
          <>
            <path d="M8 2l7 6" />
            <path d="M2 15h11" />
            <path d="M8 28l7-6" />
          </>
        )}
      </g>
    </svg>
  );
}

function EggLogo() {
  return (
    <svg width="30" height="26" viewBox="0 0 30 26" aria-hidden="true">
      <path d="M15 2c5 0 8 2 11 4s4 5 3 9-1 6-5 8-9 3-13 1S1 20 1 15s2-8 5-10 4-3 9-3z" fill="#FFFFFF" stroke="#161616" strokeWidth="1.4" />
      <circle cx="15" cy="14" r="6.5" fill="#F7C430" stroke="#161616" strokeWidth="1.2" />
      <circle cx="12.8" cy="13" r="0.9" fill="#161616" />
      <circle cx="17.2" cy="13" r="0.9" fill="#161616" />
      <path d="M13 15.6c1.2 1 2.8 1 4 0" fill="none" stroke="#161616" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  );
}

// 성수역 → 더가배성수 약도 (TODO §15: 성수역 출구 번호는 현장 확인 후)
function WalkMap() {
  return (
    <svg
      className={styles.map}
      width="357"
      height="128"
      viewBox="0 0 357 128"
      role="img"
      aria-label="Walk about 5 minutes from Seongsu Station to The Gabae Seongsu"
    >
      <g stroke="#E3E3E3" strokeLinecap="butt" fill="none">
        <path d="M-4 10H361" strokeWidth="16" />
        <path d="M96 0V128" strokeWidth="14" />
        <path d="M96 52H361" strokeWidth="10" />
        <path d="M-4 114H361" strokeWidth="14" />
        <path d="M262 52V114" strokeWidth="8" />
      </g>
      <path d="M-4 10H361" stroke="#00A84D" strokeWidth="3" />
      <path d="M110 114H361" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="8 8" />
      <text x="298" y="7" fontSize="8" fill="#6B6B6B">Achasan-ro</text>
      <text x="104" y="125" fontSize="8" fill="#6B6B6B">Yeonmujang-gil</text>
      <text x="266" y="110" fontSize="8" fill="#6B6B6B">13-gil</text>
      <circle cx="30" cy="30" r="12" fill="#00A84D" stroke="#FFFFFF" strokeWidth="2" />
      <rect x="24" y="22" width="12" height="13" rx="3" fill="none" stroke="#FFFFFF" strokeWidth="1.6" />
      <path d="M24 28h12" stroke="#FFFFFF" strokeWidth="1.3" />
      <rect x="2" y="45" width="74" height="16" rx="8" fill="#00A84D" />
      <text x="39" y="57" fontSize="10" fontWeight="700" fill="#FFFFFF" textAnchor="middle">Seongsu Stn.</text>
      <rect x="22" y="70" width="20" height="18" fill="#FFF3CC" stroke="#161616" strokeWidth="1.3" />
      <rect x="27" y="76" width="10" height="7" fill="#F7C430" stroke="#161616" strokeWidth="0.9" />
      <text x="4" y="101" fontSize="8.5" fontWeight="700" fill="#161616">Daelim Changgo</text>
      <rect x="132" y="22" width="20" height="18" fill="#FFF3CC" stroke="#161616" strokeWidth="1.3" />
      <rect x="137" y="28" width="10" height="7" fill="#F7C430" stroke="#161616" strokeWidth="0.9" />
      <text x="157" y="35" fontSize="9.5" fontWeight="700" fill="#161616">STAND OIL</text>
      <rect x="124" y="66" width="20" height="18" fill="#FFF3CC" stroke="#161616" strokeWidth="1.3" />
      <rect x="129" y="72" width="10" height="7" fill="#F7C430" stroke="#161616" strokeWidth="0.9" />
      <text x="149" y="79" fontSize="9.5" fontWeight="700" fill="#161616">Miffy Store</text>
      <path d="M96 20V52H262V78H268" fill="none" stroke="#E8336B" strokeWidth="3" strokeDasharray="6 4" strokeLinecap="round" />
      <path d="M267 71l9 7-9 7z" fill="#E8336B" />
      <text x="172" y="49" fontSize="10" fontWeight="700" fill="#E8336B">≈5 min walk</text>
      <rect x="278" y="62" width="64" height="40" fill="#2B2B2B" stroke="#161616" strokeWidth="1.4" />
      <text x="310" y="78" fontSize="9" fontWeight="700" fill="#FFFFFF" textAnchor="middle" letterSpacing="1">THE GABAE</text>
      <g fill="#9CC3E6">
        <rect x="284" y="84" width="9" height="13" />
        <rect x="296" y="84" width="9" height="13" />
        <rect x="308" y="84" width="9" height="13" />
        <rect x="320" y="84" width="9" height="13" />
        <rect x="332" y="84" width="6" height="13" />
      </g>
      <path d="M326 64c-5-6-8-9-8-13a8 8 0 0 1 16 0c0 4-3 7-8 13z" fill="#E8475B" stroke="#161616" strokeWidth="1.2" />
      <circle cx="326" cy="50" r="2.8" fill="#FFFFFF" />
      <rect x="236" y="22" width="80" height="18" rx="5" fill="#161616" />
      <text x="276" y="35" fontSize="9.5" fontWeight="700" fill="#FFFFFF" textAnchor="middle">더가배성수</text>
    </svg>
  );
}

// 신문 카드 원본 크기(397×561). 결과 화면에서는 ScaledNameCard로 0.7배
export function NameCard({ hangul, roman, meaning, message, blank = false }: NameCardProps) {
  return (
    <div className={`${styles.card} ${ibmPlexSansKr.className}`}>
      <div className={styles.rule} />
      <div className={styles.masthead}>
        <div className={styles.mastSide}>제 012호</div>
        <div className={`${styles.mastTitle} ${blackHanSans.className}`}>
          <EggLogo />
          계란일보
        </div>
        <div className={styles.mastSide} style={{ textAlign: "right" }}>
          2026.10.23–24
        </div>
      </div>
      <div className={styles.yourName}>
        <Burst color="#F7C430" />
        <div className={`${styles.yourNameText} ${anton.className}`}>YOUR NAME</div>
        <Burst color="#4A9BF5" flip />
      </div>
      <div className={styles.nameBox} data-name-box>
        {!blank && (
          <>
            <div className={`${styles.hangul} ${blackHanSans.className}`} lang="ko">
              {hangul}
            </div>
            <div className={styles.roman}>{roman}</div>
            <div className={styles.meaning}>“{meaning}”</div>
            {message && <div className={styles.message}>{message}</div>}
          </>
        )}
      </div>
      <div className={styles.divider} />
      <WalkMap />
      <div className={styles.address}>
        <b>{EVENT.venue}</b> · {EVENT.dates}, {EVENT.hours}
        <br />
        {EVENT.address}
      </div>
      <div className={styles.footer}>
        <div className={styles.footerText}>
          <div className={styles.photoLine}>
            <svg width="8" height="14" viewBox="0 0 12 20" aria-hidden="true">
              <g stroke="#F7C430" strokeWidth="2.4" strokeLinecap="round">
                <path d="M5 2l5 4" />
                <path d="M1 10h8" />
                <path d="M5 18l5-4" />
              </g>
            </svg>
            <div className={`${styles.photoText} ${anton.className}`}>You can take a photo here with your Korean name!</div>
            <svg width="8" height="14" viewBox="0 0 12 20" aria-hidden="true">
              <g stroke="#4A9BF5" strokeWidth="2.4" strokeLinecap="round">
                <path d="M7 2L2 6" />
                <path d="M11 10H3" />
                <path d="M7 18l-5-4" />
              </g>
            </svg>
          </div>
          <div className={styles.handle}>
            <span className={anton.className} style={{ fontSize: 13, fontWeight: 400 }}>
              @
            </span>
            seoul.yolk
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- 정적 SVG QR */}
        <img className={styles.qr} src="/qr-card.svg" alt="QR code to this site" width={57} height={57} />
      </div>
    </div>
  );
}

export function ScaledNameCard(props: NameCardProps) {
  return (
    <div className={styles.scaled}>
      <div className={styles.scaledInner}>
        <NameCard {...props} />
      </div>
    </div>
  );
}
