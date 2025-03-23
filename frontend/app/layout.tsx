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
  title: "Academy of Talents | Interactive 3D Learning Platform",
  description:
    "Experience immersive 3D learning at Academy of Talents. Our interactive platform offers personalized education through AI-powered avatars, engaging environments, and innovative teaching methods.",
  metadataBase: new URL("https://academyoftalents.com"),
  keywords: [
    "education",
    "3D learning",
    "interactive learning",
    "AI education",
    "virtual classroom",
    "personalized learning",
  ],
  authors: [{ name: "Academy of Talents" }],
  creator: "Academy of Talents",
  publisher: "Academy of Talents",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://academyoftalents.com",
    siteName: "Academy of Talents",
    title: "Academy of Talents | Interactive 3D Learning Platform",
    description:
      "Experience immersive 3D learning at Academy of Talents. Our interactive platform offers personalized education through AI-powered avatars, engaging environments, and innovative teaching methods.",
    images: [
      {
        url: "/teacher-classroom-bg.webp",
        width: 1200,
        height: 630,
        alt: "Academy of Talents Virtual Classroom",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Academy of Talents | Interactive 3D Learning Platform",
    description:
      "Experience immersive 3D learning at Academy of Talents. Our interactive platform offers personalized education through AI-powered avatars.",
    images: ["/teacher-classroom-bg.webp"],
    creator: "@academyoftalents",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  themeColor: "#ffffff",
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
