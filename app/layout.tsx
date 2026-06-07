import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pawpoints.co.nz"),
  title: {
    default: "PawPoints — Earn rewards for every dog walk",
    template: "%s · PawPoints",
  },
  description:
    "Auckland's wellness rewards platform. GPS-tracked dog walks earn rewards at participating local shops and cafés. Free for walkers, free first month for businesses.",
  keywords: [
    "dog walking app",
    "Auckland dog walks",
    "dog walking rewards NZ",
    "PawPoints",
    "dog rewards New Zealand",
  ],
  openGraph: {
    title: "PawPoints — Earn rewards for every dog walk",
    description:
      "GPS-tracked dog walks earn rewards at Auckland shops and cafés. Free for walkers.",
    url: "https://pawpoints.co.nz",
    siteName: "PawPoints",
    locale: "en_NZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PawPoints — Earn rewards for every dog walk",
    description: "GPS-tracked dog walks earn rewards at Auckland shops and cafés.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
