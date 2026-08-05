import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Homepage redesign fonts
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
