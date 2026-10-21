import { Anton, Black_Han_Sans, IBM_Plex_Sans_KR, Nanum_Gothic_Coding, Space_Mono } from "next/font/google";

// 제목·버튼·머리줄 (SPEC §7-2). 모든 화면에서 쓰므로 preload 한다.
export const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

// 영수증 본문(한글 고정폭). 한글 폰트라 preload를 끈다 (SPEC §16-7).
export const nanumGothicCoding = Nanum_Gothic_Coding({
  weight: ["400", "700"],
  display: "swap",
  preload: false,
});

// 신문 카드(계란일보) 전용 (SPEC §7-2). 카드가 있는 화면에서만 쓴다.
export const anton = Anton({ weight: "400", subsets: ["latin"], display: "swap", preload: false });
export const blackHanSans = Black_Han_Sans({ weight: "400", display: "swap", preload: false });
export const ibmPlexSansKr = IBM_Plex_Sans_KR({ weight: ["400", "500", "700"], display: "swap", preload: false });
