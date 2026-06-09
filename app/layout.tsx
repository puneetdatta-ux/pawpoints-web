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
    default: "PawPoints — Every walk well walked",
    template: "%s · PawPoints",
  },
  description:
    "Auckland's wellness rewards app. Turn your daily dog walk into a free coffee, treat or discount at participating local cafés and retailers. Free for walkers, forever.",
  keywords: [
    "dog walking app",
    "Auckland dog walks",
    "dog walking rewards NZ",
    "PawPoints",
    "dog rewards New Zealand",
  ],
  openGraph: {
    title: "PawPoints — Every walk well walked",
    description:
      "Turn your daily dog walk into a free coffee, treat or discount at participating local cafés and retailers. Free for walkers, forever.",
    url: "https://pawpoints.co.nz",
    siteName: "PawPoints",
    locale: "en_NZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PawPoints — Every walk well walked",
    description: "Turn your daily dog walk into a free coffee, treat or discount at participating local cafés and retailers.",
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
