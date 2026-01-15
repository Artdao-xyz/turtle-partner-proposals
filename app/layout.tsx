import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Turtle Partner Proposals",
  description: "We sit in front of an active base of LPs with on-chain, ready-to-deploy capital and provide a suite of tools for partners to run liquidity and incentive programs end to end.",
  openGraph: {
    title: "Turtle Partner Proposals",
    description: "We sit in front of an active base of LPs with on-chain, ready-to-deploy capital and provide a suite of tools for partners to run liquidity and incentive programs end to end.",
    url: "https://turtle-partner-proposals.vercel.app", // Actualiza con tu URL real
    siteName: "Turtle Partner Proposals",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Turtle Partner Proposals",
    description: "We sit in front of an active base of LPs with on-chain, ready-to-deploy capital and provide a suite of tools for partners to run liquidity and incentive programs end to end.",
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
    <html lang="en">
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
