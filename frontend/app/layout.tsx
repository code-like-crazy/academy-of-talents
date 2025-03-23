import type { Metadata } from "next";
import { Geist_Mono, Hina_Mincho, Noto_Sans_JP } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import "./globals.css";

import { auth } from "@/auth";

import { Toaster } from "@/components/ui/sonner";

const hina = Hina_Mincho({
  variable: "--font-hina",
  subsets: ["latin"],
  weight: ["400"],
});

const noto = Noto_Sans_JP({
  variable: "--font-noto",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Ugly Duckling",
  description: "An interactive 3D experience based on the classic fairy tale",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`${hina.variable} ${noto.variable} ${geistMono.variable} min-h-svh antialiased`}
      >
        <Toaster />
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
