/**
 * 쿠폰 기록 — 구글 시트에 붙여 쓰는 Apps Script (SPEC §5)
 * 쿠폰 코드는 폰에서 바로 만든다(기다림 0초). 이 스크립트는 받은 코드를 시트에 한 줄로 남기기만 한다.
 * 1. 새 구글 시트에서 확장 프로그램 > Apps Script에 이 파일을 붙여 넣는다.
 * 2. setup()을 한 번 실행한다. '쿠폰' 시트와 1행 제목이 만들어진다.
 *    (E열 전체에 체크박스를 미리 넣지 않는다. 스크립트가 줄마다 넣는다)
 * 3. 배포 > 새 배포 > 웹 앱 (실행: 나, 액세스: 모든 사용자) → 나온 주소를 NEXT_PUBLIC_COUPON_URL에 넣는다.
 *    코드를 고친 뒤에는 배포 관리 > 수정 > 새 버전으로 올려야 주소가 그대로 유지된다.
 */
const SHEET_NAME = '쿠폰';
const HEADERS = ['코드', '발급 시각', '이름 id', '유입', '사용', '사용 시각'];
const CODE_PATTERN = /^[A-Z0-9]{3}-[A-Z0-9]{3}$/;

// 시트 서식 한 번 만들기. 이미 '쿠폰' 시트가 있으면 제목 줄만 다시 맞춘다.
function setup() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0].setName(SHEET_NAME);
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold').setBackground('#FFC21A');
  sheet.setFrozenRows(1);
  sheet.getRange('B:B').setNumberFormat('yyyy-mm-dd hh:mm:ss');
  sheet.getRange('F:F').setNumberFormat('yyyy-mm-dd hh:mm:ss');
  sheet.setColumnWidths(1, HEADERS.length, 140);
}

function doGet(e) {
  const code = String(e.parameter.code || '').toUpperCase();
  if (!CODE_PATTERN.test(code)) return json({ ok: false, reason: 'bad_code' });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // 동시에 와도 한 줄씩 → 같은 코드가 두 번 적히지 않음
  try {
    const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
    // 폰이 재전송해도(전달 확인 실패 등) 한 줄만 남긴다
    const exists = sheet.getRange('A:A').createTextFinder(code).matchEntireCell(true).findNext();
    if (!exists) {
      sheet.appendRow([code, new Date(), e.parameter.name || '', e.parameter.src || '']);
      sheet.getRange(sheet.getLastRow(), 5).insertCheckboxes();
    }
    return json({ ok: true, code });
  } finally {
    lock.releaseLock();
  }
}

function json(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}

// '사용'을 체크하면 옆 칸에 사용 시각을 자동으로 적는다.
function onEdit(e) {
  const r = e.range;
  if (r.getSheet().getName() === SHEET_NAME && r.getColumn() === 5 && r.getValue() === true) {
    r.offset(0, 1).setValue(new Date());
  }
}
