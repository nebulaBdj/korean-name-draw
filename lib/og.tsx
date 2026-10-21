import { ImageResponse } from "next/og";

// OG 이미지 1200×630 (SPEC §16-6). 빌드 때 생성된다.
export const OG_SIZE = { width: 1200, height: 630 };

// 쓰는 글자만 담은 TTF를 구글 폰트에서 받는다 (satori는 woff2를 못 읽는다)
async function loadGoogleFont(family: string, weight: number, text: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!match) throw new Error(`폰트를 못 받음: ${family}`);
  return (await fetch(match[1])).arrayBuffer();
}

type OgName = { hangul: string; roman: string; meaning: string };

export async function renderOgImage(name: OgName | null) {
  const hangul = name?.hangul ?? "이름";
  const headline = name ? "MY KOREAN NAME IS" : "WHAT'S YOUR KOREAN NAME?";
  const roman = name?.roman ?? "Korean name generator";
  const meaning = name ? `“${name.meaning}”` : "Native Korean words";
  const monoText = `${headline}${roman}${meaning}YOLK MART 24 · Seoul Yolk FREE`;

  const [hanSans, mono] = await Promise.all([
    loadGoogleFont("Black+Han+Sans", 400, hangul),
    loadGoogleFont("Space+Mono", 700, monoText),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 80px",
          background: "#2D46F5",
          color: "#FFFFFF",
          fontFamily: "Space Mono",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 520 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                background: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ width: 20, height: 20, borderRadius: 10, background: "#FFC21A" }} />
            </div>
            YOLK MART 24
          </div>
          <div style={{ fontSize: 56, lineHeight: 1.1 }}>{headline}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 460, height: 22, borderRadius: 11, background: "#101C78" }} />
          <div
            style={{
              marginTop: -11,
              width: 420,
              padding: "40px 24px 36px",
              background: "#FFFFFF",
              color: "#1A1A1A",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div style={{ fontFamily: "Black Han Sans", fontSize: 150, lineHeight: 1, letterSpacing: 8 }}>{hangul}</div>
            <div style={{ fontSize: 32 }}>{roman}</div>
            <div style={{ fontSize: 24, background: "#F7C430", padding: "2px 16px", textAlign: "center" }}>{meaning}</div>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Black Han Sans", data: hanSans, weight: 400 },
        { name: "Space Mono", data: mono, weight: 700 },
      ],
    },
  );
}
