"use client";

import { useSyncExternalStore } from "react";
import { EVENT, SITE } from "@/config/site";
import { isEventOver } from "@/lib/coupon";

const subscribe = () => () => {};

// 행사 줄: 정적 HTML은 EVENT.active 기준, 화면에서는 endsAt으로 한 번 더 막는다 (SPEC §3-7)
export function EventLine({ className }: { className?: string }) {
  const over = useSyncExternalStore(subscribe, () => isEventOver(), () => !EVENT.active);
  return (
    <div className={className}>
      {over ? (
        <>
          The pop-up has ended · Next one →{" "}
          <a href={EVENT.instagram} target="_blank" rel="noopener">
            {SITE.instagramHandle}
          </a>
        </>
      ) : (
        `${EVENT.dates} · ${EVENT.venue} · ${EVENT.hours}`
      )}
    </div>
  );
}

// 행사 중에만 보이는 문단 (How it works의 부스 단계 등)
export function DuringEvent({ children }: { children: React.ReactNode }) {
  const over = useSyncExternalStore(subscribe, () => isEventOver(), () => !EVENT.active);
  return over ? null : <>{children}</>;
}
