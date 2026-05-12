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
  title: "Chroniva Photo Booth",
  description: "Capture cinematic photo moments instantly",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Chroniva",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      style={{ height: "100dvh", overscrollBehavior: "none" }}
    >
      <body className="flex flex-col bg-[#06061a]" style={{ height: "100dvh", overscrollBehavior: "none" }} suppressHydrationWarning>{children}</body>
    </html>
  );
}
