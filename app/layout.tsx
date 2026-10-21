import type { Metadata, Viewport } from "next";
import { GSC_VERIFICATION, SITE } from "@/config/site";
import { Analytics } from "@/components/layout/Analytics";
import { spaceMono } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "What's Your Korean Name? Korean Name Generator | Seoul Yolk",
    template: "%s | Seoul Yolk",
  },
  description:
    "Draw a Korean name made from native Korean words. See what it means, how to write it in Hangul and how to say it — free, in 10 seconds.",
  openGraph: { siteName: SITE.name, type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image" },
  verification: GSC_VERIFICATION ? { google: GSC_VERIFICATION } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#2D46F5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={spaceMono.variable}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
