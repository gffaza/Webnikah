import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { wedding } from "@/content/wedding";
import "./globals.css";

const notoSerif = localFont({
  src: [
    {
      path: "./fonts/noto-serif-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/noto-serif-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-noto-serif",
  display: "swap",
});

const greatVibes = localFont({
  src: [
    {
      path: "./fonts/great-vibes-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-great-vibes",
  display: "swap",
});

const couple = `${wedding.bride.nickname} & ${wedding.groom.nickname}`;

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `The Wedding of ${couple}`,
  description: `Undangan pernikahan ${couple}, ${wedding.dateLabel.weekday} ${wedding.dateLabel.day} ${wedding.dateLabel.monthYear}, ${wedding.city}.`,
  openGraph: {
    title: `The Wedding of ${couple}`,
    description: `${wedding.dateLabel.weekday}, ${wedding.dateLabel.day} ${wedding.dateLabel.monthYear} · ${wedding.city}`,
    images: [{ url: "/images/og.jpg", width: 1200, height: 630 }],
    locale: "id_ID",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f6ede8",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${notoSerif.variable} ${greatVibes.variable} h-full antialiased`}
      // Browser extensions often inject attributes onto <html> before hydrate.
      // suppressHydrationWarning
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
