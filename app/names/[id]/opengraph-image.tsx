import { OG_SIZE, renderOgImage } from "@/lib/og";
import { getName, names, toTitleRoman } from "@/lib/names";

export const alt = "Korean name card — Seoul Yolk";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return names.map(({ id }) => ({ id }));
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const name = getName((await params).id);
  if (!name) return renderOgImage(null);
  return renderOgImage({ hangul: name.hangul, roman: toTitleRoman(name.roman), meaning: name.meaning });
}
