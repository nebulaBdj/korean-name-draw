import { names, type KoreanName } from "@/lib/names";

// 균등 확률로 이름 하나 (다시 뽑기는 방금 이름 제외)
export function pickRandomName(excludeId?: string): KoreanName {
  const pool = excludeId ? names.filter((name) => name.id !== excludeId) : names;
  const [index] = crypto.getRandomValues(new Uint32Array(1));
  return pool[index % pool.length];
}
