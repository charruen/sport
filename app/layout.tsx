import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Coach Musculation Personnel — 34 Semaines",
  description:
    "Application web interactive de coaching sportif au poids du corps : progression granulaire sur 34 semaines pour maîtriser la pompe diamant, muscler les bras et dessiner les abdominaux.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/apple-icon",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Coach Sport",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} scroll-smooth dark`}>
      <body className="min-h-screen antialiased bg-zinc-950 text-zinc-100 selection:bg-emerald-500 selection:text-zinc-950">
        {children}
      </body>
    </html>
  );
}
