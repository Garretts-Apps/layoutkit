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
  title: "LayoutKit — The First Layout Language for the Web, as Pure CSS",
  description:
    "A pure-CSS stylesheet that styles semantic <lk-*> tags. Zero dependencies, zero JavaScript, no build step, no FOUC, ~2 KB brotli. Hypermedia-native, works with any server-rendered HTML. You can finally center a div.",
  openGraph: {
    title: "LayoutKit — The First Layout Language for the Web, as Pure CSS",
    description:
      "A pure-CSS stylesheet that styles semantic <lk-*> tags. Zero dependencies, zero JavaScript, no build step, no FOUC, ~2 KB brotli. You can finally center a div.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-mono antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
