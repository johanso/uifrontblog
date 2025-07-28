import type { Metadata } from "next";
import { Space_Grotesk, Inter, Fira_Code } from "next/font/google";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import TopLoader from "nextjs-toploader";
import { siteConfig } from "@/config/site";
import "./globals.css";
import Head from "next/head";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:       siteConfig.title,
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      '/favicon.ico',                   // fallback al public/favicon.ico
    ],
    apple: [
      { url: '/apple-icon-57x57.png',  sizes: '57x57',  type: 'image/png' },
      { url: '/apple-icon-60x60.png',  sizes: '60x60',  type: 'image/png' },
      { url: '/apple-icon-72x72.png',  sizes: '72x72',  type: 'image/png' },
      { url: '/apple-icon-76x76.png',  sizes: '76x76',  type: 'image/png' },
      { url: '/apple-icon-114x114.png', sizes: '114x114', type: 'image/png' },
      { url: '/apple-icon-120x120.png', sizes: '120x120', type: 'image/png' },
      { url: '/apple-icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/apple-icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'manifest',    url: '/manifest.json' },
    ],
  },
  twitter: {
    card: 'summary',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={siteConfig.locale}>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${firaCode.variable} antialiased`}
      >
        <Header />
        <TopLoader 
          color="var(--color-primary)"
          showSpinner={false}
        />
        <main className="container">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
