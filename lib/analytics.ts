// GA4 이벤트 (SPEC §9). GA_ID가 없거나 차단되면 조용히 아무것도 하지 않는다
type Events = {
  draw_start: undefined;
  draw_complete: { name_id: string; coupon_code: string; is_redraw: boolean };
  coupon_error: { reason: "timeout" | "network" | "server" };
  pronounce_click: { name_id: string };
  card_save: { method: "share" | "longpress" };
  booth_map_click: undefined;
  instagram_click: undefined;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function track<E extends keyof Events>(event: E, ...[params]: Events[E] extends undefined ? [] : [Events[E]]): void {
  try {
    window.gtag?.("event", event, params ?? {});
  } catch {
    // 분석 실패는 화면에 영향을 주지 않는다
  }
}
