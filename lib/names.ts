import data from "@/data/names.json";

// data/names.json 한 줄 (SPEC §4)
export type KoreanName = {
  id: string;
  hangul: string;
  roman: string;
  meaning: string;
  tags: string[];
  soundsLike?: string;
  message?: string;
};

export const names: readonly KoreanName[] = data;

export function getName(id: string): KoreanName | undefined {
  return names.find((name) => name.id === id);
}

// 화면 제목용 로마자: 하이픈을 빼고 첫 글자만 대문자 (Ga-ram → Garam)
export function toTitleRoman(roman: string): string {
  const plain = roman.replace(/-/g, "").toLowerCase();
  return plain.charAt(0).toUpperCase() + plain.slice(1);
}
