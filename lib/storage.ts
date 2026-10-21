// 브라우저 저장소 접근은 여기 한 곳에서 try/catch로 감싼다 (CLAUDE.md)
// 뽑기 기록은 sessionStorage: 새로고침해도 결과는 남고, 탭을 닫으면 다시 뽑을 수 있다 (10-21 결정)

const DRAW_KEY = "yolk:draw";
const SOURCE_KEY = "yolk:src";

// 이 탭에서 마지막으로 뽑은 결과
export type DrawRecord = {
  nameId: string;
  code: string;
  issuedAt: string; // ISO
  redrawn: boolean; // 다시 뽑기는 1회만
  sent: boolean; // 쿠폰 시트에 기록됐는지
};

function readJson<T>(storage: () => Storage, key: string): T | null {
  try {
    const raw = storage().getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(storage: () => Storage, key: string, value: unknown): void {
  try {
    storage().setItem(key, JSON.stringify(value));
  } catch {
    // 저장이 막힌 브라우저에서는 이번 화면에서만 유지된다
  }
}

const session = () => window.sessionStorage;

export function readDraw(): DrawRecord | null {
  return readJson<DrawRecord>(session, DRAW_KEY);
}

// useSyncExternalStore 스냅샷: 같은 값이면 같은 문자열이라 다시 그리지 않는다
export function getDrawSnapshot(): string | null {
  try {
    return window.sessionStorage.getItem(DRAW_KEY);
  } catch {
    return null;
  }
}

export function parseDraw(raw: string | null): DrawRecord | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DrawRecord;
  } catch {
    return null;
  }
}

export function writeDraw(record: DrawRecord): void {
  writeJson(session, DRAW_KEY, record);
  listeners.forEach((listener) => listener());
}

// useSyncExternalStore 구독용
const listeners = new Set<() => void>();
export function subscribeDraw(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// 첫 진입의 utm_source를 탭이 열려 있는 동안 기억한다 (SPEC §9)
export function rememberSource(search: string): void {
  const source = new URLSearchParams(search).get("utm_source");
  if (source && !readJson<string>(session, SOURCE_KEY)) writeJson(session, SOURCE_KEY, source);
}

export function readSource(): string {
  return readJson<string>(session, SOURCE_KEY) ?? "";
}
