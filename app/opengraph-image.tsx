import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "What's your Korean name? — Seoul Yolk";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage(null);
}
