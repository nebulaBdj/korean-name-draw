"use client";

import { useEffect, useState } from "react";

// 영수증 시각 표기: 2026-10-23 12:00 (서울 시각)
function formatSeoulTime(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}`;
}

// 정적 HTML에는 initialIso 시각을 넣고, 화면에 붙은 뒤 현재 시각으로 바꾼다
export function NowStamp({ initialIso }: { initialIso: string }) {
  const [label, setLabel] = useState(() => formatSeoulTime(new Date(initialIso)));

  useEffect(() => {
    const tick = () => setLabel(formatSeoulTime(new Date()));
    tick();
    const timer = setInterval(tick, 30_000);
    return () => clearInterval(timer);
  }, []);

  return <>{label}</>;
}
