import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: {
    template: "%s | FounderValue",
    default: "FounderValue — Startup Valuation for Founders",
  },
  description:
    "Value your startup from Pre-Seed to Acquisition/IPO using proven financial methods. Instantly evaluate investor offers and understand your dilution.",
  openGraph: {
    title: "FounderValue — Startup Valuation for Founders",
    description:
      "Value your startup from Pre-Seed to Acquisition/IPO. Evaluate investor offers instantly.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="antialiased">
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
