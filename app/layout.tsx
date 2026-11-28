import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Leaves } from "./_components/decorations";
import ConnectionLines from "./_components/ConnectionLines";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TownsSquare — Neighbourhood sharing and mutual aid",
  description: "A neighbourhood toolkit for sharing tools, running community kitchens and organising mutual aid.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Leaves />
        <ConnectionLines />
        {children}
      </body>
    </html>
  );
}