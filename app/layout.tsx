import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ChatBot from "./components/ChatBot";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// The "Academia" font
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pherbert.vercel.app'),
  title: "Patrick Herbert | ML Engineer",
  description: "Machine Learning Engineer & Researcher.",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Patrick Herbert',
    title: 'Patrick Herbert | ML Engineer',
    description: 'Machine Learning Engineer & Researcher.',
  },
  twitter: {
    card: 'summary',
    title: 'Patrick Herbert | ML Engineer',
    description: 'Machine Learning Engineer & Researcher.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} antialiased`}
      >
        {children}
        <ChatBot />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}