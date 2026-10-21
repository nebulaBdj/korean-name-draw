import { EVENT, SITE } from "@/config/site";
import { blackHanSans, ibmPlexSansKr, nanumGothicCoding, spaceMono } from "@/lib/fonts";
import type { KoreanName } from "@/lib/names";

// 스토리 이미지 1080×1920 (SPEC §6, design/F5Story 2배). 쿠폰 코드는 넣지 않는다.
const W = 1080;
const H = 1920;
const PAPER = { x: 182, y: 380, w: 716 };
const CARD = { x: 214, y: 412, w: 652, h: 920 }; // 397×561 카드를 652폭으로
const K = CARD.w / 397; // 카드 1px → 이미지 px
const NAME_BOX = { x: 20, y: 120, w: 357, h: 176 }; // 카드 안 이름 칸 (테두리 포함)
const TEMPLATE_SRC = "/card-template.png"; // 이름 칸을 비운 카드 2배 PNG

const family = (font: { style: { fontFamily: string } }) => font.style.fontFamily;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

// 폰트를 다 불러온 뒤 그린다 (대체 폰트로 그려지는 것 방지)
async function loadFonts(name: KoreanName): Promise<void> {
  const text = `${name.hangul}${name.roman}${name.meaning}${name.message ?? ""}`;
  await Promise.all([
    document.fonts.load(`400 70px ${family(blackHanSans)}`, name.hangul),
    document.fonts.load(`700 15px ${family(ibmPlexSansKr)}`, text),
    document.fonts.load(`500 12px ${family(ibmPlexSansKr)}`, text),
    document.fonts.load(`700 48px ${family(spaceMono)}`, "MY KOREAN NAME IS"),
    document.fonts.load(`700 28px ${family(nanumGothicCoding)}`, "YOLK MART 24 · 성수 팝업점"),
    document.fonts.load(`400 28px ${family(nanumGothicCoding)}`, EVENT.venue),
  ]);
  await document.fonts.ready;
}

// 최대 폭을 넘으면 단어 단위로 줄을 나눈다
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// 이름 칸: 한글 → 로마자 → 노란 뜻 띠 → 메시지, 세로 가운데 (NameCard와 같은 크기 비율)
function drawNameBox(ctx: CanvasRenderingContext2D, name: KoreanName): void {
  const s = (px: number) => px * K;
  const centerX = CARD.x + s(NAME_BOX.x + NAME_BOX.w / 2);

  ctx.font = `400 ${s(70)}px ${family(blackHanSans)}`;
  const hangulHeight = s(70 * 1.02);
  const romanHeight = s(15 * 1.4);
  const meaningHeight = s(12 * 1.5 + 2);
  ctx.font = `italic 400 ${s(11)}px ${family(ibmPlexSansKr)}`;
  const messageLines = name.message ? wrapText(ctx, name.message, s(300)) : [];
  const messageHeight = messageLines.length ? s(3) + messageLines.length * s(11 * 1.35) : 0;
  const gap = s(3);
  const total = hangulHeight + gap + romanHeight + gap + s(2) + meaningHeight + (messageLines.length ? gap + messageHeight : 0);

  let y = CARD.y + s(NAME_BOX.y + NAME_BOX.h / 2) - total / 2;
  ctx.fillStyle = "#161616";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.font = `400 ${s(70)}px ${family(blackHanSans)}`;
  ctx.fillText(name.hangul.split("").join(String.fromCharCode(0x200a)), centerX, y + hangulHeight / 2);
  y += hangulHeight + gap;

  ctx.font = `700 ${s(15)}px ${family(ibmPlexSansKr)}`;
  ctx.fillText(name.roman, centerX, y + romanHeight / 2);
  y += romanHeight + gap + s(2);

  ctx.font = `500 ${s(12)}px ${family(ibmPlexSansKr)}`;
  const meaning = `“${name.meaning}”`;
  const bandWidth = ctx.measureText(meaning).width + s(18);
  ctx.fillStyle = "#F7C430";
  ctx.fillRect(centerX - bandWidth / 2, y, bandWidth, meaningHeight);
  ctx.fillStyle = "#161616";
  ctx.fillText(meaning, centerX, y + meaningHeight / 2);
  y += meaningHeight + gap;

  if (messageLines.length) {
    y += s(3);
    ctx.font = `italic 400 ${s(11)}px ${family(ibmPlexSansKr)}`;
    ctx.fillStyle = "#2B2B2B";
    for (const line of messageLines) {
      ctx.fillText(line, centerX, y + s(11 * 1.35) / 2);
      y += s(11 * 1.35);
    }
  }
}

function drawScissors(ctx: CanvasRenderingContext2D, top: number): void {
  ctx.save();
  ctx.strokeStyle = "#A9B0C4";
  ctx.lineWidth = 4;
  ctx.setLineDash([12, 8]);
  ctx.beginPath();
  ctx.moveTo(PAPER.x, top + 20);
  ctx.lineTo(PAPER.x + PAPER.w, top + 20);
  ctx.stroke();
  ctx.setLineDash([]);
  // 가위 아이콘 (16px 아이콘 2배)
  ctx.translate(PAPER.x + 20, top + 6);
  ctx.scale(2, 2);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, 16, 16);
  ctx.strokeStyle = "#7A8299";
  ctx.lineWidth = 1.4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(3.5, 4, 2.4, 0, Math.PI * 2);
  ctx.moveTo(5.9, 12);
  ctx.arc(3.5, 12, 2.4, 0, Math.PI * 2);
  ctx.moveTo(5.5, 5.3);
  ctx.lineTo(15, 11.5);
  ctx.moveTo(5.5, 10.7);
  ctx.lineTo(15, 4.5);
  ctx.stroke();
  ctx.restore();
}

function zigzagPath(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
  const teeth = 24;
  const step = width / (teeth * 2);
  ctx.moveTo(x, y);
  for (let i = 1; i <= teeth * 2; i++) ctx.lineTo(x + i * step, i % 2 === 1 ? y + height : y);
  ctx.closePath();
}

export async function drawStoryImage(name: KoreanName): Promise<Blob> {
  const [template] = await Promise.all([loadImage(TEMPLATE_SRC), loadFonts(name)]);
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas를 쓸 수 없음");

  ctx.fillStyle = "#2D46F5";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = `700 48px ${family(spaceMono)}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("MY KOREAN NAME IS", W / 2, 268);

  // 종이 (그림자 포함): 카드 → 가위 점선 → 영수증 꼬리 3줄 → 톱니
  const scissorsTop = CARD.y + CARD.h;
  const tailTop = scissorsTop + 44 + 8;
  const lineHeight = 43;
  const tailBottom = tailTop + lineHeight * 3 + 24;
  ctx.save();
  ctx.shadowColor = "rgba(8, 14, 70, 0.4)";
  ctx.shadowBlur = 44;
  ctx.shadowOffsetY = 32;
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.rect(PAPER.x, PAPER.y, PAPER.w, tailBottom - PAPER.y);
  zigzagPath(ctx, PAPER.x, tailBottom - 1, PAPER.w, 18);
  ctx.fill();
  ctx.restore();

  // 프린터 슬롯 (종이 위에 겹친다)
  ctx.fillStyle = "#101C78";
  ctx.beginPath();
  ctx.roundRect(132, 360, 816, 40, 20);
  ctx.fill();

  ctx.drawImage(template, CARD.x, CARD.y, CARD.w, CARD.h);
  ctx.strokeStyle = "#E3E3E3";
  ctx.lineWidth = 2;
  ctx.strokeRect(CARD.x, CARD.y, CARD.w, CARD.h);
  drawNameBox(ctx, name);
  drawScissors(ctx, scissorsTop);

  ctx.fillStyle = "#1A1A1A";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const tail: [string, string][] = [
    ["700", "YOLK MART 24 · 성수 팝업점"],
    ["400", `${EVENT.venue} · ${EVENT.dates} · ${EVENT.hours}`],
    ["700", `Get yours → link in ${SITE.instagramHandle} bio`],
  ];
  tail.forEach(([weight, text], i) => {
    ctx.font = `${weight} 28px ${family(nanumGothicCoding)}`;
    ctx.fillText(text, W / 2, tailTop + lineHeight * i + lineHeight / 2);
  });

  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("PNG 생성 실패"))), "image/png"),
  );
}

// 인스타·페북·카톡 등 앱 안 브라우저
export function isInAppBrowser(): boolean {
  return /Instagram|FBAN|FBAV|KAKAOTALK|Line\//i.test(navigator.userAgent);
}
