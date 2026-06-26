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
  title: "LayoutKit — The First Layout Language for the Web",
  description:
    "10 semantic layout components that compile to native CSS. Zero dependencies, no Tailwind, no build step — full IntelliSense, framework-agnostic. You can finally center a div.",
  openGraph: {
    title: "LayoutKit — The First Layout Language for the Web",
    description:
      "10 semantic layout components that compile to native CSS. Zero dependencies, no Tailwind, no build step — full IntelliSense, framework-agnostic. You can finally center a div.",
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
