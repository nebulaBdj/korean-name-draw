"use client";

import { useSyncExternalStore } from "react";
import { getDrawSnapshot, parseDraw, subscribeDraw, type DrawRecord } from "@/lib/storage";

// 이 브라우저의 뽑기 기록. 정적 HTML(서버)에서는 항상 null
export function useDrawRecord(): DrawRecord | null {
  const raw = useSyncExternalStore(subscribeDraw, getDrawSnapshot, () => null);
  return parseDraw(raw);
}
