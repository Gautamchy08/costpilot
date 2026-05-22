import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CostPilot — Stop Overpaying for AI Tools",
  description:
    "Free 2-minute audit reveals exactly where your team is overspending on AI tools — and how to save up to 40%. Analyze Cursor, Copilot, Claude, ChatGPT, and more.",
  keywords: [
    "AI spend audit",
    "AI cost optimization",
    "Cursor pricing",
    "GitHub Copilot ROI",
    "AI tools comparison",
    "developer tools savings",
  ],
  openGraph: {
    title: "CostPilot — Stop Overpaying for AI Tools",
    description:
      "Free 2-minute audit reveals exactly where your team is overspending on AI — and how to save up to 40%.",
    type: "website",
    siteName: "CostPilot",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CostPilot — Stop Overpaying for AI Tools",
    description:
      "Free 2-minute audit reveals where you're overspending on AI and how to save up to 40%.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a0a1a] text-[#e2e8f0]">
        {children}
      </body>
    </html>
  );
}
