import { AudioEngineProvider } from "@/lib/audio/audio-engine-context";
import type { Metadata, Viewport } from "next";
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
  title: "まいふぁーピアノ",
  description: "子供向けのオンラインピアノアプリケーション",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "まいふぁーピアノ",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFF8F0",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AudioEngineProvider>{children}</AudioEngineProvider>
      </body>
    </html>
  );
}
