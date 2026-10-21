// 행사·쿠폰처럼 바뀌는 값은 여기 한 곳에서 바꾼다 (SPEC §8)

export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://korean-name-draw.vercel.app", // canonical·sitemap 기준 주소
  name: "Seoul Yolk",
  instagramHandle: "@seoul.yolk",
};

export const EVENT = {
  active: true, // 행사가 끝나면 false로 바꿔 재배포 (§3-7)
  name: "Seongsu Pop-up",
  dates: "Oct 23–24",
  hours: "12:00–19:00",
  venue: "The Gabae Seongsu", // 랜딩 행사 줄에 쓰는 짧은 이름
  place: "The Gabae Seongsu (더가배성수)",
  address: "11, Yeonmujang 13-gil, Seongdong-gu, Seoul",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=The%20Gabae%20Seongsu",
  startsAt: "2026-10-23T12:00:00+09:00", // 영수증 시각의 초기값(정적 HTML)
  endsAt: "2026-10-24T19:00:00+09:00",
  instagram: "https://instagram.com/seoul.yolk",
};

export const COUPON = {
  mode: "sheet" as "sheet" | "shared" | "rule", // §5-0: 업체 답변에 따라 결정 (TODO §15)
  sharedCode: "YOLK1023", // "shared"일 때 모두에게 보여줄 코드
  url: process.env.NEXT_PUBLIC_COUPON_URL, // Apps Script 웹 앱 주소. 없으면 쿠폰 자리에 'Show this screen at the booth'
  timeoutMs: 5000,
};

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID; // 없으면 분석 코드는 조용히 꺼진다
export const GSC_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION; // Search Console HTML 태그 토큰
