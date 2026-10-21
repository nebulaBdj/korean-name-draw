// 한글 음절 → 자모 → 로마자 (SPEC §4 읽는 법). 국어의 로마자 표기법 기본값.

const INITIALS = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
const MEDIALS = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"];
const FINALS = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

const INITIAL_ROMAN: Record<string, string> = {
  ㄱ: "g", ㄲ: "kk", ㄴ: "n", ㄷ: "d", ㄸ: "tt", ㄹ: "r", ㅁ: "m", ㅂ: "b", ㅃ: "pp", ㅅ: "s",
  ㅆ: "ss", ㅇ: "–", ㅈ: "j", ㅉ: "jj", ㅊ: "ch", ㅋ: "k", ㅌ: "t", ㅍ: "p", ㅎ: "h",
};
const MEDIAL_ROMAN: Record<string, string> = {
  ㅏ: "a", ㅐ: "ae", ㅑ: "ya", ㅒ: "yae", ㅓ: "eo", ㅔ: "e", ㅕ: "yeo", ㅖ: "ye", ㅗ: "o", ㅘ: "wa", ㅙ: "wae",
  ㅚ: "oe", ㅛ: "yo", ㅜ: "u", ㅝ: "wo", ㅞ: "we", ㅟ: "wi", ㅠ: "yu", ㅡ: "eu", ㅢ: "ui", ㅣ: "i",
};
// 받침은 대표음으로 읽는다
const FINAL_ROMAN: Record<string, string> = {
  ㄱ: "k", ㄲ: "k", ㅋ: "k", ㄳ: "k", ㄺ: "k",
  ㄴ: "n", ㄵ: "n", ㄶ: "n",
  ㄷ: "t", ㅅ: "t", ㅆ: "t", ㅈ: "t", ㅊ: "t", ㅌ: "t", ㅎ: "t",
  ㄹ: "l", ㄼ: "l", ㄽ: "l", ㄾ: "l", ㅀ: "l",
  ㅁ: "m", ㄻ: "m",
  ㅂ: "p", ㅍ: "p", ㅄ: "p", ㄿ: "p",
  ㅇ: "ng",
};

const SYLLABLE_BASE = 0xac00;
const SYLLABLE_COUNT = 11172;

export type Jamo = { letter: string; roman: string };
export type SyllableReading = { syllable: string; jamo: Jamo[] };

// 음절 하나를 초성·중성·종성으로 나눈다. 한글 음절이 아니면 null
export function decomposeSyllable(syllable: string): string[] | null {
  const offset = syllable.charCodeAt(0) - SYLLABLE_BASE;
  if (offset < 0 || offset >= SYLLABLE_COUNT) return null;
  const initial = INITIALS[Math.floor(offset / 588)];
  const medial = MEDIALS[Math.floor((offset % 588) / 28)];
  const final = FINALS[offset % 28];
  return final ? [initial, medial, final] : [initial, medial];
}

// 자모 위치(초·중·종)에 맞는 로마자
export function romanizeJamo(letters: string[]): Jamo[] {
  return letters.map((letter, index) => ({
    letter,
    roman: index === 0 ? INITIAL_ROMAN[letter] : index === 1 ? MEDIAL_ROMAN[letter] : FINAL_ROMAN[letter],
  }));
}

export function readHangul(word: string): SyllableReading[] {
  return Array.from(word).flatMap((syllable) => {
    const letters = decomposeSyllable(syllable);
    return letters ? [{ syllable, jamo: romanizeJamo(letters) }] : [];
  });
}
