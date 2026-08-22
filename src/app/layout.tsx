import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { PwaRegister } from "@/components/PwaRegister";
import { Shell } from "@/components/Shell";
import "./globals.css";

const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const sans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  applicationName: "Contemporary Art Hub",
  title: {
    default: "Contemporary Art Hub",
    template: "%s · Contemporary Art Hub",
  },
  description:
    "A simple guide to contemporary art: movements, artists, a quiz, and a studio.",
  manifest: `${base}/manifest.webmanifest`,
  appleWebApp: {
    capable: true,
    title: "Art Hub",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: `${base}/icons/icon-192.png`, sizes: "192x192", type: "image/png" },
      { url: `${base}/icons/icon-512.png`, sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: `${base}/icons/apple-touch-icon.png`, sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f3eee4",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="grain min-h-screen bg-paper font-sans text-ink antialiased">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <Shell>{children}</Shell>
        <PwaRegister />
      </body>
    </html>
  );
}
