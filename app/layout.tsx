import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SiteCelebration from "./components/SiteCelebration";

// Self-hosted (app/fonts/, latin-subset variable fonts) since 2026-11-16:
// next/font/google fetches from Google at BUILD time, and a failed fetch took
// the whole Vercel deploy down (34 module-not-found errors for the font CSS).
// Same families and CSS variables as before, no visual change.
const geistSans = localFont({
  src: "./fonts/geist.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/geist-mono.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Homepage redesign fonts
const fraunces = localFont({
  src: "./fonts/fraunces.woff2",
  variable: "--font-fraunces",
  weight: "100 900",
  display: "swap",
});

const hankenGrotesk = localFont({
  src: "./fonts/hanken.woff2",
  variable: "--font-hanken",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pawpoints.co.nz"),
  title: {
    default: "PawPoints — Turn daily walks into local discounts",
    template: "%s · PawPoints",
  },
  description:
    "Auckland's dog-walking rewards app. Earn points on every walk and redeem them with local cafés and retailers as they join PawPoints. Free for walkers.",
  keywords: [
    "dog walking app",
    "Auckland dog walks",
    "dog walking rewards NZ",
    "PawPoints",
    "dog rewards New Zealand",
  ],
  openGraph: {
    title: "PawPoints — Turn daily walks into local discounts",
    description:
      "Earn points on every dog walk and redeem them with local cafés and retailers as they join PawPoints. Free for walkers.",
    url: "https://pawpoints.co.nz",
    siteName: "PawPoints",
    locale: "en_NZ",
    type: "website",
    // Shown when the link is shared on WhatsApp, Facebook, LinkedIn, Slack,
    // iMessage. Without it these render as a small text-only card.
    images: [
      {
        url: "/og-image.png",
        width: 1024,
        height: 500,
        alt: "PawPoints — walk, earn, treat your dog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PawPoints — Turn daily walks into local discounts",
    description: "Earn points on every dog walk and redeem them with local cafés and retailers as they join PawPoints.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${hankenGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <SiteCelebration />
      </body>
    </html>
  );
}
