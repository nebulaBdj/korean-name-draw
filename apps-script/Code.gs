/**
 * 쿠폰 발급 — 구글 시트에 붙여 쓰는 Apps Script (SPEC §5)
 * 1. 구글 시트에 '쿠폰' 시트를 만들고 1행에 제목: 코드 | 발급 시각 | 이름 id | 유입 | 사용 | 사용 시각
 *    (E열 전체에 체크박스를 미리 넣지 않는다. 스크립트가 줄마다 넣는다)
 * 2. 확장 프로그램 > Apps Script에 이 파일을 붙여 넣는다.
 * 3. 배포 > 새 배포 > 웹 앱 (실행: 나, 액세스: 모든 사용자) → 나온 주소를 NEXT_PUBLIC_COUPON_URL에 넣는다.
 */
const SHEET_NAME = '쿠폰';
const CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function doGet(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // 동시에 와도 한 명씩 → 같은 번호가 두 번 나가지 않음
  try {
    const props = PropertiesService.getScriptProperties();
    const seq = Number(props.getProperty('SEQ') || '0') + 1; // 행 수가 아니라 저장된 카운터로 센다
    props.setProperty('SEQ', String(seq));
    const code = String(seq).padStart(4, '0') + '-' + makeTail(seq);

    const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
    sheet.appendRow([code, new Date(), e.parameter.name || '', e.parameter.src || '']);
    sheet.getRange(sheet.getLastRow(), 5).insertCheckboxes();

    return ContentService.createTextOutput(JSON.stringify({ code }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// 뒤 2글자. 지금은 무작위(남의 번호 짐작 방지).
// 업체가 '규칙으로 확인'(SPEC §5-0 "rule")을 하기로 하면, 업체와 맞춘 비밀 규칙으로 이 함수만 바꾼다.
function makeTail(seq) {
  const pick = () => CHARS[Math.floor(Math.random() * CHARS.length)];
  return pick() + pick();
}

// '사용'을 체크하면 옆 칸에 사용 시각을 자동으로 적는다.
function onEdit(e) {
  const r = e.range;
  if (r.getSheet().getName() === SHEET_NAME && r.getColumn() === 5 && r.getValue() === true) {
    r.offset(0, 1).setValue(new Date());
  }
}
