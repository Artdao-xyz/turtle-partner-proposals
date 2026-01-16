import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://turtle-partner-proposals.vercel.app";
};

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Turtle Partner Proposals",
  description: "We sit in front of an active base of LPs with on-chain, ready-to-deploy capital and provide a suite of tools for partners to run liquidity and incentive programs end to end.",
  openGraph: {
    title: "Turtle Partner Proposals",
    description: "We sit in front of an active base of LPs with on-chain, ready-to-deploy capital and provide a suite of tools for partners to run liquidity and incentive programs end to end.",
    url: baseUrl,
    siteName: "Turtle Partner Proposals",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Turtle Partner Proposals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Turtle Partner Proposals",
    description: "We sit in front of an active base of LPs with on-chain, ready-to-deploy capital and provide a suite of tools for partners to run liquidity and incentive programs end to end.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ backgroundColor: 'var(--black-turtle)' }}>
      <body
        className={`${dmSans.variable} antialiased`}
        style={{ backgroundColor: 'var(--black-turtle)' }}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
