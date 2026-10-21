# korean-name-draw

Seoul Yolk 성수 팝업(2026.10.23–24)용 외국인 대상 '한국 이름 뽑기' 사이트. 무엇을 만드는지는 `SPEC.md`, 화면은 `design/` 폴더가 기준이다.

## 기본 규칙
- 사이트 문구는 영어, 코드 주석과 커밋 메시지는 한국어.
- `SPEC.md` §14 순서대로 한 단계씩 진행한다. 단계가 끝나면 멈추고, 한 일과 내가 직접 확인·설정할 것을 짧게 알려준다.
- 배포 전에 `npm run build`가 통과해야 한다.
- 정해지지 않은 것(SPEC §15)은 추측하지 말고 config 값이나 TODO로 남긴다.
- `design/` 파일은 참고용이다. 수정하지 않는다.

## 스택
- Next.js(App Router) + TypeScript, 정적 생성. Vercel 배포.
- 상태관리 라이브러리 없음, 애니메이션은 CSS, 의존성은 최소로.
- 쿠폰 발급만 Google Apps Script(`apps-script/Code.gs`).
- 이 폴더에는 이미 파일이 있어 `create-next-app`을 바로 실행할 수 없다. 임시 폴더에 만든 뒤 옮기거나 직접 구성한다.

## 폴더 구조 (목표)
```
app/
  page.tsx                랜딩 + 뽑기(F1·F2), 아래 소개·FAQ
  names/page.tsx          이름 목록
  names/[id]/page.tsx     결과(F3) / 이름 페이지(SPEC 3-8)
  sitemap.ts  robots.ts  opengraph-image.tsx
components/receipt/       Slot, Paper, Leader, Dash, Barcode, Zigzag, JamoTiles …
components/name-card/     NameCard (design/NameCard.dc.html)
lib/                      names.ts, hangul.ts(자모 분해·로마자), coupon.ts, storage.ts, analytics.ts, story-image.ts
config/site.ts            SITE·EVENT·COUPON (SPEC §8)
data/names.json
design/                   디자인 참고 파일
apps-script/Code.gs       쿠폰 발급 스크립트
```

## 코드 규칙
- UI는 props와 로컬 상태로만 그린다. 공유할 수 있는 화면 상태의 원천은 URL이다(결과 = `/names/[id]`).
- 원본 데이터를 내려보내고, 파생 값은 쓰는 곳 옆에서 계산한다.
- 가공은 이름 있는 순수 함수의 합성으로 만든다(예: `decomposeSyllable` → `romanizeJamo`).
- 행사·쿠폰처럼 바뀌는 값은 config로 주입한다. 공용화는 중복이 두 번째 확인된 뒤에 한다.
- localStorage 접근은 `lib/storage.ts` 한 곳에서 try/catch로 감싼다.

## SEO 규칙 (SPEC §16)
- 검색엔진이 보는 HTML에 본문이 들어가야 한다. 클라이언트 컴포넌트는 인쇄 연출·쿠폰·공유·발음만.
- 크롤링되는 `<a href>`에 쿼리 파라미터 금지. UTM은 외부 링크에만, 화면 상태는 localStorage·onClick.
- 페이지마다 metadata(title·description·canonical·OG), h1은 하나.
- 한글 폰트는 쓰는 화면에서만 `next/font`로 불러오고 preload를 끈다.
