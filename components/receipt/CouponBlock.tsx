import { COUPON, SITE } from "@/config/site";
import { Barcode } from "./Barcode";
import styles from "./receipt.module.css";

export type CouponState =
  | { kind: "code"; code: string } // 사람마다 다른 코드 ("sheet"·"rule")
  | { kind: "shared" } // 모두 같은 코드 ("shared")
  | { kind: "screen" } // 기록할 곳이 없음 → 화면을 보여주기
  | { kind: "ended" }; // 행사 종료 (SPEC §3-7)

// 영수증의 쿠폰 부분 (SPEC §3-3, §5-0)
export function CouponBlock({ state }: { state: CouponState }) {
  if (state.kind === "ended") {
    return (
      <>
        <div className={styles.couponTitle}>영업 종료 · THE POP-UP HAS ENDED</div>
        <div className={styles.couponNote}>Follow {SITE.instagramHandle} for the next one!</div>
      </>
    );
  }

  return (
    <>
      <div className={styles.couponTitle}>부스 할인 쿠폰 · BOOTH COUPON</div>
      <div className={styles.couponNote}>
        {state.kind === "shared" ? (
          "Enter this code at the booth kiosk for a discount!"
        ) : (
          <>
            Show this at the booth for a discount
            <br />
            on your newspaper photo!
          </>
        )}
      </div>
      <Barcode height={38} style={{ marginTop: 6 }} />
      {state.kind === "screen" ? (
        <div className={styles.couponNote} style={{ fontWeight: 700, color: "var(--ink)", marginTop: 4 }}>
          Show this screen at the booth
        </div>
      ) : (
        <>
          <div className={styles.couponCode}>{state.kind === "shared" ? COUPON.sharedCode : state.code}</div>
          {state.kind === "code" && <div className={styles.couponNote}>1회 사용 · One-time use</div>}
        </>
      )}
    </>
  );
}
