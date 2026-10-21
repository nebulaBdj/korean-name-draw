# Seoul Yolk — Korean Name Draw (v1) 설계서

> 이 폴더(`korean-name-draw/`)에서 Claude Code를 실행하고 "CLAUDE.md와 SPEC.md를 읽고 §14 1단계부터 만들어줘"로 시작한다.
> 사이트 안의 문구는 전부 영어(외국인 대상), 이 문서와 코드 주석은 한국어.
> **화면 디자인의 기준은 `design/` 폴더**다. 디자인 캔버스의 '최종 (편의점)' 페이지와 같은 파일이다.

## 1. 목표

- 10/23(금)~24(토) 성수 팝업(더가배성수)에서 **종이 카드 없이 QR·인스타 링크로** 한국 이름 뽑기를 진행한다.
- 결과 화면의 **부스 할인 쿠폰**으로 포토부스 방문·결제(매출)를 만든다.
- 이름 뽑기가 부스 방문으로 이어지는지, 종이 뽑기(오프라인)와 비교할 수 있는 데이터를 남긴다. 직원이 확인하지 못하는 시간대에도 SNS를 보고 온 참여자를 추적한다.
- 인스타 홍보 게시물(“What’s your Korean name? Find out in Seongsu!”)의 **프로필 링크 목적지**가 된다. 게시물이 올라가는 시점에 사이트가 열려 있어야 한다.
- 행사가 끝난 뒤에도 `Korean name generator` 같은 검색으로 들어오는 사이트로 남긴다(SEO, §16).

### 성공 지표

| 지표 | 계산 |
| --- | --- |
| 참여율 | 뽑기 완료 수 ÷ 사이트 접속 수 (GA4) |
| 부스 전환율 | 쿠폰 사용 수 ÷ 쿠폰 발급 수 (쿠폰 기록, 유입 경로별로도) |
| 인스타 유입 | 인스타 프로필 링크로 들어온 접속 수, 그중 쿠폰을 쓴 수 |
| 공유율 | 이미지 저장·공유 수 ÷ 뽑기 완료 수 (GA4) |
| 오프라인 비교 | 종이 뽑기 시간(또는 날)의 뽑기 수 대비 부스 방문 수 |
| 검색 유입 (행사 후) | Search Console 노출·클릭, 이름 페이지별 유입 |

## 2. v1 범위

**포함**
- 랜딩 → 영수증 인쇄 연출 → 결과(신문 카드 + 영수증: 이름·로마자·뜻·한 줄 메시지·읽는 법·발음 듣기·부스 할인 쿠폰) → 스토리 공유·이미지 저장, 길찾기, 인스타 팔로우
- 쿠폰 코드 발급과 사용 확인 (§5)
- 검색 노출용 정적 페이지: 이름 목록 `/names`, 이름별 페이지 `/names/[id]` 40개, sitemap·robots·구조화 데이터·OG 이미지 (§16)
- 행사가 끝나면 쿠폰·길찾기 대신 "다음 팝업 소식은 인스타에서"로 전환
- GA4 이벤트, UTM 유입 경로 구분, Search Console 등록
- 행사 정보는 설정 파일 하나로 바꿀 수 있게

**제외 (v2 이후)**
- 성격 질문 후 맞춤 이름
- 등급·확률·인구 비율 표시 (v1은 **뜻만** 보여준다)
- 신문 QR 맛집 페이지, 다른 언어 페이지
- 서버·DB (쿠폰 발급용 구글 시트만 예외)
- A/B 테스트 (이틀 유입으로는 결론이 나지 않아 v1은 한 디자인만)

## 3. 화면과 흐름

컨셉: **서울 편의점 영수증.** `PRINT MY NAME`을 누르면 영수증 프린터에서 이름이 인쇄돼 나오고, 그 위로 신문 카드(계란일보)가 이어져 나온다. 실제 부스에서 신문 사진을 뽑아 가는 경험의 예고편이다.

모바일 세로 화면 기준(375~430px). 데스크톱은 가운데 정렬된 모바일 폭으로 보여준다. **인스타그램 앱 안 브라우저가 주 진입 경로**이므로 그 환경을 기준으로 만든다.

### 3-0. 페이지 구성

| 주소 | 내용 | 렌더링 |
| --- | --- | --- |
| `/` | 랜딩 + 인쇄 연출 + 아래쪽 소개·FAQ | 정적 HTML, 뽑기 부분만 클라이언트 |
| `/names/[id]` | 뽑은 사람에게는 결과(신문 카드 + 쿠폰 영수증), 링크로 온 사람에게는 이름 소개 + 내 이름 뽑기 버튼 | 정적 HTML 40개, 쿠폰·공유 부분만 클라이언트 |
| `/names` | 이름 40개 목록 (한글·로마자·뜻) | 정적 HTML |
| `/sitemap.xml`, `/robots.txt` | 검색엔진용 | 빌드 때 생성 |

| 화면 | 디자인 파일 |
| --- | --- |
| ① 랜딩 | `design/F1Landing.dc.html` |
| ② 인쇄 연출 | `design/F2Print.dc.html` |
| ③ 결과 | `design/F3Result.dc.html` |
| ④ 공유 시트 위 안내 | `design/F4Share.dc.html` |
| ⑤ 스토리 이미지 | `design/F5Story.dc.html` |
| 예외: 인스타 앱 안 저장 | `design/F6Fallback.dc.html` |
| 행사 종료 후 결과 | `design/F7After.dc.html` |
| 신문 카드(공용) | `design/NameCard.dc.html` |

> `design/*.dc.html`은 디자인 도구용 HTML이라 브라우저에서 그대로 열리지 않는다. 마크업·인라인 스타일·SVG를 참고해 React 컴포넌트로 옮긴다. `<dc-import name="NameCard" …>`는 NameCard 컴포넌트 자리, `{{hangul}}` 같은 표시는 props 자리다. NameCard 안의 QR 이미지(`/_blob/…`)는 새로 만든다(§7-4). 화면 속 이름·코드·시각(가람, 0417-KM 등)은 예시 값이다.

### 3-1. 랜딩 `/`
- 머리줄: 노른자 로고 + `YOLK MART 24`, 오른쪽 `@seoul.yolk`
- 제목(h1) `What's your Korean name?`, 부제 `Get a free Korean name made from native Korean words.`
- 가운데: 프린터 슬롯 + 아직 비어 있는 영수증
  - `YOLK MART 24` / `Seongsu pop-up` (시각 줄 없음, 10-21 가독성 개선)
  - 받는 것과 설명: `Korean name ··· 1` (+ meaning & how to say it), `Newspaper card ··· 1` (+ image for your IG story), `Booth coupon ··· 1` (discount on a real newspaper photo, 행사 중에만), `TOTAL ··· ₩0 FREE`, 바코드, `감사합니다! Thank you!`
  - 오른쪽 위 `FREE` 스티커(`no sign-up`). 1+1은 뜻이 애매해 뺐다
- 버튼 하나: `PRINT MY NAME →`
- 아래: `Oct 23–24 · The Gabae Seongsu · 12:00–19:00`
- **스크롤 아래 (검색용 본문, 같은 영수증 스타일)**
  - `What's a native Korean name?` — Native Korean names (순우리말) come from everyday Korean words, not Chinese characters. 하늘 (Haneul) means “sky” and 가람 (Garam) means “river”.
  - `How it works` — 1. Print your name 2. Learn how to write and say it 3. Share it (행사 중에는 `Get it printed in a real newspaper photo at our pop-up` 단계 추가)
  - FAQ 4개 (h2/h3, 본문 텍스트로)
    - `Is it free?` — Yes. It takes about 10 seconds.
    - `How do I say my name?` — Tap ▶ to hear it in Korean. Your result also shows how the Hangul letters combine.
    - `Can I use it as my Korean name?` — Yes. Every name is a real Korean word that also works as a given name or nickname.
    - `How many names are there?` — 40 native Korean names. `See all 40 names →` (`/names`)

### 3-2. 인쇄 연출 (약 1.6초)
- 버튼을 누르면 `names.json`에서 균등 확률로 이름을 고르고, **폰에서 쿠폰 코드를 바로 만든다**(§5). 시트 기록은 응답을 기다리지 않는다.
- 제목 `Printing your Korean name…`, 노른자 점이 깜빡이는 `PRINTING…`
- 영수증이 슬롯에서 한 줄씩 끊기듯 내려온다(`steps()` 애니메이션, 키프레임은 F2Print 파일의 helmet 참고). 종이 아래쪽(감사 인사·바코드)부터 나오고 이름 줄이 마지막에 나온다.
- 연출이 끝나면 `router.push('/names/{id}')`로 결과 페이지로 간다. 쿠폰 때문에 기다리는 일은 없다.
- `prefers-reduced-motion`이면 연출 없이 바로 결과. 소리는 없다.

### 3-3. 결과 `/names/[id]` (뽑은 사람)
- 이 탭의 sessionStorage에 이 이름을 뽑은 기록이 있으면 이 화면이다(없으면 3-8).
- 위: `PRINTED!` + 발급 시각
- 프린터 슬롯에서 이어져 나온 **한 장의 종이**(폭 300px):
  1. **신문 카드** (NameCard, §7-4) — 저장·공유 이미지와 같은 그림
  2. **가위 점선** — 위는 공유 이미지, 아래는 화면 전용
  3. **영수증**
     - `품목 ITEM / 수량 QTY`
     - `{hangul} · {roman} ({meaning})  1` (예: `가람 · Ga-ram (River)  1`)
     - `신문 카드 Newspaper card  1+1`
     - `읽는 법 HOW TO READ` + 자모 칸: `[ㄱ] g [ㅏ] a =가   [ㄹ] r [ㅏ] a [ㅁ] m =람` (§4)
     - `발음 SAY IT ··· {roman} ▶` — Web Speech API(`speechSynthesis`, `lang="ko-KR"`)로 한글 이름을 읽는다. `soundsLike`가 있으면 그 표기를 쓴다(빛나 → `bin-na`). 한국어 음성이 없는 기기에서는 ▶만 숨긴다.
     - `합계 TOTAL ··· ₩0 FREE`
     - `부스 할인 쿠폰 · BOOTH COUPON` / `Show this at the booth for a discount on your newspaper photo!` / 바코드 / **쿠폰 코드** `0417-KM` / `1회 사용 · One-time use` (공통 코드 방식이면 §5-0 문구)
     - `감사합니다! Thank you!`, 아래 톱니 모양 끝
- 버튼: `SHARE TO MY STORY`(주) / `SAVE IMAGE` · `DIRECTIONS ↗`(지도 링크)
- 작은 링크: `Follow @seoul.yolk`, `Try once more`
- 다시 뽑기: **1회만**. 이름과 주소(`/names/{새 id}`, `router.replace`)만 바뀌고 **쿠폰 코드는 그대로**(1인 1쿠폰). 이후 링크 숨김.
- 이름 쪽 한 줄 메시지(`message`)는 신문 카드 안에 나온다(가람·새벽).
- 이 주소를 그대로 공유해도 된다. 받은 사람에게는 3-8 화면이 보인다(쿠폰은 안 보임).

### 3-4. 공유·저장
- `SHARE TO MY STORY`, `SAVE IMAGE` 모두 1080×1920 PNG(§6)를 만들어 `navigator.share({ files })`로 공유 시트를 연다(시트의 'Save Image'로 저장 가능).
- 공유 시트가 떠 있는 동안 화면 위에 말풍선: `Tap Instagram → Stories, then tag @seoul.yolk` (웹에서는 태그·스티커를 미리 붙일 수 없다)
- 공유가 안 되는 환경(인스타 앱 안 등) → 3-5 화면

### 3-5. 예외: 인스타 앱 안에서 저장
- 노른자 안내: `Saving works best in your browser. Tap ••• at the top, then Open in browser.`
- 제목 `Press & hold to save`, 스토리 이미지를 `<img>`로 크게 보여줌
- 순서: `Press and hold the image → Save to Photos` / `Open Instagram → Story → pick the image` / `Tag @seoul.yolk so we can see it`
- `← Back to my name`

### 3-6. 재방문
- 같은 탭에서 `/`를 다시 열면 마지막 결과 주소로 안내한다(`See my name →`). 결과와 쿠폰 코드는 sessionStorage에 있다. 탭을 닫으면 지워져 다시 뽑을 수 있다(10-21 결정: 다시 뽑기 쉽게. 그만큼 쿠폰이 더 발급될 수 있다). 접근이 막힌 브라우저에서도 화면이 깨지지 않게 try/catch.

### 3-7. 행사 종료 후 (`endsAt` 이후)
- 쿠폰을 발급하지 않는다.
- 영수증의 쿠폰 부분 대신 `영업 종료 · THE POP-UP HAS ENDED` / `Follow @seoul.yolk for the next one!`
- `DIRECTIONS ↗` 대신 `FOLLOW US ↗`, 링크는 `Try once more`만
- 랜딩 아래 행사 줄 → `The pop-up has ended · Next one → @seoul.yolk`, How it works에서 부스 단계 제거
- 신문 카드는 그대로 둔다(날짜가 찍힌 기념 카드).
- 정적 HTML에 남는 행사 문구는 클라이언트에서 `endsAt`으로 한 번 더 막고, 행사가 끝나면 `EVENT.active = false`로 바꿔 재배포한다(검색엔진이 보는 HTML도 정리).

### 3-8. 이름 페이지 `/names/[id]` (링크·검색으로 온 사람)
- 신문 카드 + 짧은 영수증(품목, 읽는 법, 발음 ▶, 합계 `₩0 FREE`). 쿠폰 칸은 없다.
- 버튼 `PRINT MY OWN NAME →` (`/`)
- `More names like this` — 같은 태그(`tags`)의 다른 이름 3~4개 링크, `See all 40 names →`
- h1 = `{hangul} ({Roman}) — Korean name meaning “{meaning}”`

### 3-9. 이름 목록 `/names`
- h1 `Native Korean names and meanings`, 한 줄 소개, 40개를 작은 영수증 카드 격자로(한글 · 로마자 · 뜻 → 각 이름 페이지 링크)
- 아래 `PRINT MY NAME →` (`/`)

## 4. 이름 데이터 `data/names.json`

```json
{ "id": "haneul", "hangul": "하늘", "roman": "Ha-neul", "meaning": "Sky", "tags": ["nature", "freedom"], "soundsLike": "선택", "message": "선택" }
```

- 순우리말 두 글자 40개 (포토부스 이름 입력 글자 수 제한 때문에 두 글자 유지). `id`가 주소가 된다(`/names/haneul`).
- `meaning`: 한두 단어 뜻, `message`: 뜻을 풀어 쓴 한 줄 메시지(선택, 현재 가람·새벽)
- `tags`: 3-8의 `More names like this`에 쓴다.
- **읽는 법(자모 칸)은 코드로 만든다.** 한글 음절을 유니코드 공식으로 초성·중성·종성으로 나누고, 국어의 로마자 표기법 기본값으로 적는다. 초성 ㅇ은 소리가 없으니 `–`, 받침은 대표음(ㄱ→k, ㄹ→l, ㅇ→ng 등). 칸이 넘치면 음절 단위로 줄을 바꾼다.
- 화면 제목용 로마자: `roman`에서 하이픈을 빼고 첫 글자만 대문자(`Ga-ram` → `Garam`).
- **팀 검수 필요:** 뜻 영어 번역과 로마자 표기를 두 명이 한 번씩 확인한다.
- SEO 보강(행사 후 가능): 이름별 1~2문장 설명 `about` 필드 — Claude Code가 초안, 팀 검수.

## 5. 부스 할인 쿠폰 코드

### 5-0. 할인 적용 방식 (업체 답변 후 확정)
써니사이드업(린덜루님)을 통해 키오스크 외주 업체에 확인 중. 세 방식을 설정 한 줄(`COUPON.mode`)로 바꿀 수 있게 만든다. 답변 전 기본값은 `"sheet"`.

| 모드 | 업체 답 | 동작 |
| --- | --- | --- |
| `"shared"` | 1안: 키오스크에 공통 쿠폰 코드 등록 가능 | 결과 화면 쿠폰 자리에 모두 같은 코드(`COUPON.sharedCode`, 예: `YOLK1023`)를 보여준다. 문구는 `Enter this code at the booth kiosk for a discount!`(`1회 사용` 줄 숨김). 발급 요청·시트 안 씀, 사용 건수는 키오스크 기록 |
| `"rule"` | 2안: 키오스크가 규칙으로 개별 코드 확인 가능 | 5-1처럼 스크립트가 발급하되 뒤 2글자를 **비밀 규칙**(비밀 키로 만든 HMAC)으로 만든다. 같은 규칙을 키오스크가 확인하고 사용 기록을 남긴다. 규칙·비밀 키는 Apps Script와 업체에만 두고 사이트 코드에는 넣지 않는다 |
| `"sheet"` | 3안: 직원 확인 + 키오스크 할인 버튼 | 아래 5-1~5-5 그대로. 직원이 시트에서 확인·체크한 뒤 키오스크 버튼으로 할인가 결제 |

### 5-1. 발급: 폰에서 바로 + 시트에 기록 (`"sheet"`, `"rule"`)
- 2026-10-21 변경: Apps Script 응답이 첫 호출 5.4초, 평소 약 2.4초라 기다리지 않도록 바꿨다.
- 뽑는 순간 폰이 코드를 만든다: 영문 대문자·숫자 6자(0·O·1·I·L 제외) `XXX-XXX`, `crypto.getRandomValues`. 1천 건 기준 겹칠 확률 약 0.06%.
- 동시에 Apps Script 웹 앱에 `?code=&name={id}&src={utm_source}` GET을 보낸다(`no-cors`, `keepalive`). 응답은 기다리지 않는다.
- 스크립트는 같은 코드가 시트에 없을 때만 한 줄을 추가한다(재전송해도 한 줄). `LockService`로 차례로 처리한다.
- 지어낸 코드는 시트에 없으므로 부스에서 걸러진다.

### 5-2. 전달 실패
- 네트워크 오류로 전달되지 않으면 sessionStorage의 `sent: false`로 남고, 결과 화면을 다시 열 때 재전송한다.
- 그래도 시트에 없으면 부스에서 결과 화면을 확인하고 시트 맨 아래에 직접 한 줄 추가(코드 칸에 화면의 코드) 후 할인한다.
- `NEXT_PUBLIC_COUPON_URL`이 없으면 코드 대신 `Show this screen at the booth`를 보여준다.
- 다시 뽑기·재방문 때는 같은 코드를 쓴다(1인 1쿠폰).

### 5-4. 시트와 스크립트
- 시트 이름 `쿠폰`, 1행은 제목: `A 코드 | B 발급 시각 | C 이름 id | D 유입(utm_source) | E 사용 | F 사용 시각`.
- 체크박스는 스크립트가 줄마다 넣는다(E열 전체에 미리 넣으면 빈 체크박스도 내용으로 쳐서 새 줄이 맨 아래로 밀린다). 개인정보는 저장하지 않는다.
- 스크립트: `apps-script/Code.gs` (시트 메뉴 '확장 프로그램 > Apps Script'에 붙여 넣고 '웹 앱'으로 배포, 실행: 나, 액세스: 모든 사용자). `"rule"` 모드가 정해지면 뒤 2글자 만드는 부분만 바꾼다.

### 5-5. 부스에서 확인하는 법 (`"sheet"`)
1. 손님 폰의 결과 화면에서 쿠폰 코드를 본다(예: `8KE-YGH`).
2. 구글 시트 앱에서 코드를 검색한다.
3. '사용' 칸이 비어 있으면 체크하고 키오스크 할인 버튼으로 결제한다. 이미 체크돼 있으면 사용된 쿠폰이다.

## 6. 스토리 이미지 (저장·공유)

- `<canvas>`로 1080×1920 PNG를 그린다(F5Story가 절반 크기 시안). html-to-image 같은 DOM 캡처는 iOS에서 불안정하므로 쓰지 않는다.
- 구성: 코발트 배경, `MY KOREAN NAME IS`, 프린터 슬롯, 종이(신문 카드 → 가위 점선 → 영수증 꼬리 3줄 → 톱니 끝)
  - 영수증 꼬리: `YOLK MART 24 · 성수 팝업점` / `The Gabae Seongsu · Oct 23–24 · 12–7pm` / `Get yours → link in @seoul.yolk bio`
  - **쿠폰 코드는 넣지 않는다**(스토리로 코드가 퍼지는 것 방지).
- 위 250px·아래 340px는 인스타 화면 요소가 가리는 자리라 비워 둔다.
- 신문 카드 그리기: 고정 부분(제호·틀·약도·주소·QR)은 **PNG 템플릿 한 장**(2배 해상도)으로 만들어 두고, 이름 칸(한글·로마자·뜻)과 메시지만 canvas에 글자로 쓴다. 템플릿은 `design/NameCard.dc.html`을 이름 칸을 비운 상태로 렌더링해서 만든다(Playwright 스크린샷 등).
- 폰트를 다 불러온 뒤 그린다(`document.fonts.load` → `document.fonts.ready`).
- 저장 방식: `navigator.canShare({ files })`가 되면 `navigator.share`로 공유 시트, 안 되면 3-5 화면(길게 눌러 저장). 인앱 브라우저를 감지하면 3-5의 노른자 안내를 띄운다.

## 7. 디자인

### 7-1. 색

| 용도 | 값 |
| --- | --- |
| 배경 | `#2D46F5` (코발트) |
| 프린터 슬롯 | `#101C78` |
| 종이 | `#FFFFFF` |
| 영수증 글자 / 보조 글자 | `#1A1A1A` / `#666666` |
| 배경 위 보조 글자 | `#DCE2FF`, `#C9D2FF` |
| 노른자 포인트 (로고·1+1 스티커·말풍선·인쇄 표시등) | `#FFC21A` |
| 랜딩 버튼 | `#0E0E12` 바탕 + 흰 글자 |
| 결과 주 버튼 / 보조 버튼 | 흰 바탕 + 코발트 글자 / 흰 테두리 |

### 7-2. 폰트
- `Space Mono` 400·700 — 제목, 버튼, 머리줄, 쿠폰 코드
- `Nanum Gothic Coding` 400·700 — 영수증 본문(한글 고정폭, 줄 맞춤이 중요)
- 신문 카드: `Anton`, `Black Han Sans`, `IBM Plex Sans KR` (NameCard 파일 참고)
- 모두 `next/font`로 자가 호스팅. 한글 폰트는 쓰는 화면에서만 불러오고 preload를 끈다(§16-7).

### 7-3. 영수증 부품
- 프린터 슬롯: 높이 16px 둥근 막대, 안쪽 그림자. 종이가 슬롯 아래로 8px 들어가 보이게 겹친다.
- 종이: 폭 300px(결과)·292px(랜딩), 그림자 `drop-shadow(0 12px 16px rgba(8, 14, 70, 0.35))`
- 구분선 1.5px 점선(dashed), 항목과 값 사이 점 리더 1.5px dotted
- 가위 점선: 신문 카드와 영수증 사이
- 톱니 끝: 아래 가장자리 삼각형 반복 SVG(높이 9px)
- 바코드: **장식용 SVG**(실제 스캔하지 않음, 코드 글자가 기준)
- `1+1` 스티커: 노른자 원 64px, 12° 회전
- 자모 칸: 20px 정사각 테두리 + 옆에 로마자
- 랜딩 아래 본문·이름 목록도 같은 부품(종이·점선·리더)으로 꾸민다.

### 7-4. 신문 카드 (NameCard)
- 397×561 비율(결과 화면에서는 0.7배 = 278×393)
- 제호줄 `제 012호 | 계란일보 | 2026.10.23–24`, `YOUR NAME`, 이름 칸(한글 크게 + 로마자 + 노란 뜻 띠 + 메시지), 약도(성수역 → 더가배성수, 도보 약 5분), 주소 알약, 하단 `You can take a photo here with your Korean name!` · `@seoul.yolk` · QR
- QR은 사이트 주소(`?utm_source=card&utm_medium=qr&utm_campaign=seongsu_1023`)로 새로 만든다.
- 약도의 성수역 출구 번호는 현장 확인 후 넣는다.

### 7-5. 공통
- 버튼은 엄지로 누르기 쉬운 높이(48px 이상), 화면 아래쪽
- 화면의 문구·간격은 `design/` 파일을 그대로 따른다.

## 8. 설정 `config/site.ts`

```ts
export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://korean-name-draw.vercel.app", // canonical·sitemap 기준 주소
  name: "Seoul Yolk",
};
export const EVENT = {
  active: true, // 행사가 끝나면 false로 바꿔 재배포 (§3-7)
  name: "Seongsu Pop-up",
  dates: "Oct 23–24",
  hours: "12:00–19:00",
  place: "The Gabae Seongsu (더가배성수)",
  address: "11, Yeonmujang 13-gil, Seongdong-gu, Seoul",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=The%20Gabae%20Seongsu",
  endsAt: "2026-10-24T19:00:00+09:00",
  instagram: "https://instagram.com/seoul.yolk",
};
export const COUPON = {
  mode: "sheet" as "sheet" | "shared" | "rule", // §5-0: 업체 답변에 따라 결정
  sharedCode: "YOLK1023",                         // "shared"일 때 모두에게 보여줄 코드
  url: process.env.NEXT_PUBLIC_COUPON_URL,        // Apps Script 웹 앱 주소. 없으면 쿠폰 자리에 'Show this screen at the booth'
  timeoutMs: 5000,
};
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;                     // 없으면 분석 코드는 조용히 꺼진다
export const GSC_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION; // Search Console HTML 태그 토큰
```

## 9. 분석 (GA4)

### 유입 경로 (주소에 UTM — 외부 링크에만)
- 현장 QR: `?utm_source=popup&utm_medium=qr&utm_campaign=seongsu_1023`
- 인스타 프로필 링크: `?utm_source=instagram&utm_medium=bio&utm_campaign=seongsu_1023`
- 신문 카드 QR: `?utm_source=card&utm_medium=qr&utm_campaign=seongsu_1023`
- 첫 진입의 `utm_source`는 sessionStorage에 기억했다가 쿠폰 요청(`src`)에 같이 보낸다.

### 이벤트

| 이벤트 | 언제 | 파라미터 |
| --- | --- | --- |
| `draw_start` | PRINT MY NAME 누름 | — |
| `draw_complete` | 결과 표시 | `name_id`, `coupon_code`(없으면 `none`), `is_redraw` |
| `coupon_error` | 쿠폰 발급 실패 | `reason` (`timeout` / `network` / `server`) |
| `pronounce_click` | 발음 ▶ | `name_id` |
| `card_save` | 이미지 공유·저장 성공 또는 길게 눌러 저장 화면 열림 | `method` (`share` / `longpress`) |
| `booth_map_click` | DIRECTIONS 버튼 | — |
| `instagram_click` | 팔로우 버튼·링크 | — |

- gtag는 `next/script`로 넣는다. GA4 관리 화면에서 `name_id`, `coupon_code`, `is_redraw`, `method`, `reason`을 **맞춤 측정기준(이벤트 범위)**으로 등록해야 보고서에 보인다.
- 당일 확인은 GA4 **실시간** 화면, 정리된 숫자는 다음 날 보고서에서 본다.
- 광고 차단기나 일부 인앱 브라우저에서는 기록이 빠질 수 있다. **부스 전환은 쿠폰 기록(시트 또는 키오스크)을 기준 데이터**로 쓴다.

## 10. 현장 운영 (10/23~24)

- 부스 확인 담당 1명(`"sheet"` 모드일 때): 폰이나 태블릿에 구글 시트 앱을 열어 두고(편집 권한) §5-5 순서대로 확인한다.
- 종이 뽑기와 온라인 뽑기를 나눠 운영한다. 나누는 단위(날짜별 또는 시간대별)는 게시물 안내와 맞춘다. **확정 필요**
- 날짜별로 나누면 금요일·토요일 유동 인구 차이가 결과에 섞인다 → 숫자는 **안내한 인원 대비 비율**로 비교한다.
- 시간대마다 기록: 안내한 인원(대략), 종이 뽑기 수 또는 QR 표지판 앞 반응, 부스 방문 수. 온라인 쿠폰은 시트·키오스크에 자동으로 남는다.
- 준비물: QR 표지판(A4·A3, UTM 포함), 인스타 프로필 링크(UTM 포함), 쿠폰 시트, 종이 뽑기 집계표

## 11. 기술 스택과 배포

- **Next.js (App Router) + TypeScript**, 정적 생성(`generateStaticParams`로 이름 페이지 40개). 검색엔진이 보는 HTML에 본문이 다 들어가게 하려고 SPA 대신 정적 생성을 쓴다.
- 클라이언트 컴포넌트는 인쇄 연출·쿠폰·공유·발음 부분만. 상태관리 라이브러리 없이, 애니메이션은 CSS.
- **Vercel** 배포 (GitHub 연결, 프로젝트 이름 `korean-name-draw`)
- 쿠폰 발급만 Google Apps Script 웹 앱 + 구글 시트
- 환경변수: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_COUPON_URL`, `NEXT_PUBLIC_GSC_VERIFICATION`
- 의존성은 최소로. 뽑기 기계 같은 그림 파일은 필요 없다(영수증은 CSS·SVG).

## 12. 일정

| 날짜 | 할 일 |
| --- | --- |
| 10/21(수) | 디자인 확정(편의점), 설계 갱신, 1단계 배포, GA4 속성·구글 시트 만들기 |
| 10/22(목) 오전 | **최소 버전 배포** (랜딩·인쇄·결과·쿠폰·이름 페이지) → 인스타 게시물·프로필 링크 연결, Search Console 등록·sitemap 제출 |
| 10/22(목) 오후 | 스토리 이미지·공유, GA4 이벤트, 인앱 브라우저 대응, 행사 종료 전환, OG 이미지 |
| 10/22(목) 밤 | QA, QR 표지판 인쇄, 부스 확인 리허설(쿠폰 3개 발급 → 확인) |
| 10/23~24 | 운영 |
| 10/24 19시 이후 | `EVENT.active = false`로 재배포 |

인스타 게시물은 사이트가 열린 뒤에 올린다. 먼저 올려야 하면 그 시점엔 최소 버전이라도 배포돼 있어야 한다.

## 13. QA 체크리스트

- [ ] **인스타그램 앱 내 브라우저**(iOS·안드로이드)에서 뽑기·결과·쿠폰·저장 확인
- [ ] iPhone Safari / Android Chrome에서 같은 확인
- [ ] 영수증 한글 고정폭 폰트가 제대로 불러와지는지(대체 폰트면 줄 맞춤이 깨짐)
- [ ] 인쇄 연출이 인앱 브라우저에서 끊기지 않는지, 움직임 줄이기 설정에서 바로 결과로 가는지
- [ ] 쿠폰: 두 폰으로 동시에 뽑아도 번호가 다른지, 시트에 한 줄씩 쌓이는지, 체크하면 사용 시각이 찍히는지
- [ ] 쿠폰: 인터넷을 끄고 뽑았을 때 `Show this screen at the booth`로 바뀌는지
- [ ] 다시 뽑기 1회 제한, 다시 뽑아도 쿠폰 코드 유지, 새로고침 후 결과 유지
- [ ] 결과 주소를 다른 폰에서 열면 쿠폰 없는 이름 페이지(3-8)가 나오는지
- [ ] 두 글자 모두 받침이 있는 이름(한별·한결·윤슬·한솔·한빛)의 자모 칸이 넘치지 않는지
- [ ] 한국어 음성이 없는 기기에서 ▶가 숨겨지는지
- [ ] 저장된 PNG에 폰트가 제대로 들어갔는지, 위·아래 안전 영역을 지켰는지, 쿠폰 코드가 안 들어갔는지
- [ ] `endsAt` 이후 쿠폰 발급이 멈추고 '팝업 종료' 안내로 바뀌는지 (시계를 바꿔서 확인)
- [ ] GA4 실시간 화면에 이벤트와 UTM 유입 경로가 찍히는지
- [ ] **SEO:** 페이지 소스 보기에 본문·title·description·canonical이 들어 있는지, `/sitemap.xml`에 42개 주소가 있는지, 크롤링되는 링크에 쿼리 파라미터가 없는지
- [ ] **SEO:** Lighthouse(모바일) SEO 100·성능 90 이상, 카카오톡·인스타 DM에 링크를 보냈을 때 OG 미리보기가 나오는지
- [ ] QR 표지판을 인쇄해서 1~2m 거리에서 실제로 찍히는지

## 14. Claude Code 진행 순서

1. **뼈대:** Next.js 생성, `config/site.ts`·`data/names.json` 연결, 랜딩(F1) 정적 화면 + 기본 metadata → **이 단계 끝나면 바로 배포**
2. **쿠폰:** `apps-script/Code.gs` 확인 → 동준이 시트에 붙여 웹 앱으로 배포 → 주소를 `NEXT_PUBLIC_COUPON_URL`에 넣기
3. **뽑기·결과:** 인쇄 연출(F2), 무작위 선택, 쿠폰 생성·기록, sessionStorage, `/names/[id]` 결과(F3)와 이름 페이지(3-8), 자모 분해, 발음 듣기, 다시 뽑기 1회
4. **SEO:** `/names` 목록, 페이지별 metadata·canonical, 랜딩 아래 본문·FAQ, sitemap·robots, 구조화 데이터, OG 이미지, Search Console 확인 태그
5. **이미지·공유:** 카드 템플릿 PNG 생성, canvas 1080×1920(F5), 공유·길게 눌러 저장(F4·F6), 인앱 안내
6. **분석:** gtag 삽입, 이벤트 7종
7. **마무리:** 행사 종료 전환(F7), QA 체크리스트, 재배포, UTM 포함 QR 이미지 생성(현장 표지판·신문 카드용)

## 15. 정해야 할 것

- **할인 금액과 적용 방법** (린덜루님 통해 외주 업체 확인 중) → §5-0 모드 결정
- **도메인** (Vercel 기본 주소 vs 구매): SEO를 길게 볼 거면 Search Console 등록 전에 정하는 게 좋다. 나중에 바꾸면 새 도메인으로 다시 등록·리다이렉트해야 한다. 신문 카드 QR 주소도 이걸로.
- 쿠폰 시트를 만들 구글 계정, 부스 확인 담당자
- 종이 뽑기·온라인 뽑기를 나누는 단위 (날짜별인지, 시간대별인지)
- GA4 속성 생성과 측정 ID (동준)
- 약도의 성수역 출구 번호 (현장 확인)

## 16. SEO

### 16-1. 검색어 목표
- 주: `Korean name generator`, `what's my Korean name`
- 보조: `Korean name meaning`, `native Korean names`, `pure Korean names`, 이름별 `garam meaning` 같은 검색

### 16-2. 메타데이터 (Next.js `metadata` / `generateMetadata`)

| 페이지 | title | description |
| --- | --- | --- |
| `/` | What's Your Korean Name? Korean Name Generator \| Seoul Yolk | Draw a Korean name made from native Korean words. See what it means, how to write it in Hangul and how to say it — free, in 10 seconds. |
| `/names` | Native Korean Names and Meanings (40 Names) \| Seoul Yolk | All 40 native Korean names in our draw, with Hangul, romanization and meaning. |
| `/names/[id]` | {Roman} ({hangul}) — Korean Name Meaning “{meaning}” \| Seoul Yolk | {hangul} ({Roman}) is a native Korean name meaning “{meaning}”. See how to write it in Hangul and how to say it, then draw your own. |

- 모든 페이지: canonical(쿼리 없는 주소), `<html lang="en">`, Open Graph·Twitter(`summary_large_image`), theme-color `#2D46F5`, 파비콘·apple-touch-icon(노른자 로고)
- 페이지마다 h1은 하나. 이름 페이지의 한글 이름은 텍스트로(이미지 아님).

### 16-3. 주소 규칙 (파라미터 URL 폭증 방지)
- 크롤링되는 `<a href>`에는 쿼리 파라미터를 넣지 않는다. UTM은 외부 링크(QR·인스타)에만 붙인다.
- 뽑기 결과·쿠폰·연출 상태는 sessionStorage와 onClick 라우팅으로 다룬다. 결과 주소는 `/names/[id]` 하나뿐이다.
- 끝 슬래시 규칙을 하나로 통일하고, 없는 이름 id는 404를 돌려준다.

### 16-4. 구조화 데이터 (JSON-LD)
- `/`: `WebSite` (name `Seoul Yolk`, url) — 검색 결과의 사이트 이름용
- `/names/[id]`: `BreadcrumbList` (Home › Names › Garam)
- FAQ는 본문 텍스트로만 둔다. FAQ 리치 결과는 지금 구글이 일반 사이트에는 보여주지 않아 `FAQPage`는 생략한다.

### 16-5. sitemap·robots
- `app/sitemap.ts`: `/`, `/names`, `/names/[id]` 40개 (`lastModified` = 빌드 시각)
- `app/robots.ts`: 전체 허용 + sitemap 주소

### 16-6. OG 이미지
- `opengraph-image.tsx`(`next/og`)로 빌드 때 생성: 홈 1장 + 이름별 40장 (코발트 배경 + 영수증 + 한글 이름, 1200×630). 한글은 폰트 파일(TTF)을 넣어서 그린다.
- 카카오톡·인스타 DM에 링크를 보냈을 때 미리보기가 이 이미지로 나온다.

### 16-7. 성능 (Core Web Vitals)
- 첫 화면은 정적 HTML, 뽑기 컴포넌트만 클라이언트에서 붙인다.
- `next/font`로 폰트 자가 호스팅. 한글 폰트(Nanum Gothic Coding·Black Han Sans·IBM Plex Sans KR)는 쓰는 화면에서만, preload 끔.
- 목표(모바일): LCP 2.5초 이하, CLS 0.1 이하. 영수증·카드 영역은 높이를 미리 잡아 레이아웃이 밀리지 않게 한다.

### 16-8. Search Console·GA4 등록 (동준)
1. 배포 주소(또는 도메인)를 확정한다.
2. Search Console 속성 추가: vercel.app 주소면 'URL 접두어' + HTML 태그 방식 → 토큰을 `NEXT_PUBLIC_GSC_VERIFICATION`에 넣고 재배포 → 확인. 커스텀 도메인이면 '도메인' 속성 + DNS TXT.
3. Sitemaps에 `sitemap.xml` 제출, URL 검사로 `/`·`/names` 색인 요청
4. GA4 관리 → 제품 링크 → Search Console 연결

### 16-9. 행사 후
- 행사 문구·쿠폰을 끈 상태(`EVENT.active = false`)로 재배포해도 `/`, `/names`, `/names/[id]`는 그대로 남아 검색 유입을 받는다.
- 이름별 설명(`about`) 추가로 이름 페이지를 보강한다. 다른 언어 페이지는 v2.
