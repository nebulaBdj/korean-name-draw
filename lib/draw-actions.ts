import { isEventOver, makeCouponCode, sendCoupon } from "@/lib/coupon";
import { pickRandomName } from "@/lib/draw";
import { readDraw, readSource, writeDraw, type DrawRecord } from "@/lib/storage";

// 쿠폰을 시트에 보내고, 전달되면 기록에 표시한다 (응답을 기다리는 화면은 없다)
export function syncCoupon(record: DrawRecord): void {
  if (record.sent || !record.code) return;
  void sendCoupon({ code: record.code, nameId: record.nameId, source: readSource() }).then((ok) => {
    const latest = readDraw();
    if (ok && latest && latest.code === record.code) writeDraw({ ...latest, sent: true });
  });
}

// 첫 뽑기: 이름 고르기 + 쿠폰 코드 만들기 + 기록
export function drawFirst(): DrawRecord {
  const name = pickRandomName();
  const record: DrawRecord = {
    nameId: name.id,
    code: isEventOver() ? "" : makeCouponCode(),
    issuedAt: new Date().toISOString(),
    redrawn: false,
    sent: false,
  };
  writeDraw(record);
  syncCoupon(record);
  return record;
}

// 다시 뽑기 1회: 이름만 바뀌고 쿠폰 코드는 그대로 (1인 1쿠폰)
export function drawAgain(current: DrawRecord): DrawRecord {
  const record: DrawRecord = { ...current, nameId: pickRandomName(current.nameId).id, redrawn: true };
  writeDraw(record);
  return record;
}
