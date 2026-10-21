import { SITE } from "@/config/site";
import styles from "./result.module.css";

type StoryFallbackProps = {
  imageUrl: string | null;
  inApp: boolean;
  onBack: () => void;
};

// 공유 시트를 못 여는 환경(인스타 앱 안 등): 길게 눌러 저장 (SPEC §3-5)
export function StoryFallback({ imageUrl, inApp, onBack }: StoryFallbackProps) {
  return (
    <div className={styles.fallback}>
      {inApp && (
        <div className={styles.notice}>
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" style={{ flex: "none", marginTop: 1 }}>
            <circle cx="9" cy="9" r="7.5" fill="none" stroke="#0E0E12" strokeWidth="1.5" />
            <path d="M9 8v5M9 5.2v.1" stroke="#0E0E12" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <div>
            Saving works best in your browser. Tap <b>•••</b> at the top, then <b>Open in browser</b>.
          </div>
        </div>
      )}
      <h2 className={styles.fallbackTitle}>Press &amp; hold to save</h2>
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- 방금 만든 blob 이미지
        <img className={styles.storyImage} src={imageUrl} alt="My Korean name story image" width={270} height={480} />
      ) : (
        <div className={styles.storyImage} />
      )}
      <ol className={styles.steps}>
        <li>
          Press and hold the image → <b>Save to Photos</b>
        </li>
        <li>Open Instagram → Story → pick the image</li>
        <li>
          Tag <b>{SITE.instagramHandle}</b> so we can see it
        </li>
      </ol>
      {imageUrl && !inApp && (
        <a className={styles.back} href={imageUrl} download="my-korean-name.png">
          Download image ↓
        </a>
      )}
      <button type="button" className={styles.back} onClick={onBack}>
        ← Back to my name
      </button>
    </div>
  );
}
