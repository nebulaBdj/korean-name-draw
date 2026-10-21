import { COUPON, EVENT } from "@/config/site";
import type { CouponState } from "@/components/receipt/CouponBlock";

// 쿠폰 코드: 폰에서 바로 만든다. 헷갈리는 글자(0·O·1·I·L) 제외
const CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function makeCouponCode(): string {
  const bytes = new Uint32Array(6);
  crypto.getRandomValues(bytes);
  const chars = Array.from(bytes, (n) => CHARS[n % CHARS.length]).join("");
  return `${chars.slice(0, 3)}-${chars.slice(3)}`;
}

export function isEventOver(now: Date = new Date()): boolean {
  return !EVENT.active || now >= new Date(EVENT.endsAt);
}

// 시트 기록은 응답을 기다리지 않는다. 화면은 이미 코드를 보여주고 있다.
// no-cors라 응답 내용은 못 보지만, 네트워크 오류가 없으면 전달된 것으로 본다.
export async function sendCoupon(params: { code: string; nameId: string; source: string }): Promise<boolean> {
  if (!COUPON.url || COUPON.mode === "shared") return false;
  const query = new URLSearchParams({ code: params.code, name: params.nameId, src: params.source });
  try {
    await fetch(`${COUPON.url}?${query}`, { mode: "no-cors", keepalive: true });
    return true;
  } catch {
    return false;
  }
}

// 결과 화면의 쿠폰 칸에 무엇을 보여줄지
export function couponStateFor(code: string | undefined): CouponState {
  if (isEventOver()) return { kind: "ended" };
  if (COUPON.mode === "shared") return { kind: "shared" };
  if (!COUPON.url || !code) return { kind: "screen" };
  return { kind: "code", code };
}
