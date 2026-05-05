import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/layout/Navbar";
import FloatingBadge from "../components/ui/FloatingBadge";
import Footer from "../components/layout/Footer";
import AIChat from "@/components/ui/AIChat";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "CINEGUIDE | Рекомендації кіно",
  description: "Гібридна модель персоналізації відеоконтенту",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className={inter.className}>
        <Navbar />
        <div className="pt-20 min-h-screen">
          {children}
        </div>
        <Footer />
        <FloatingBadge />
        <AIChat />
      </body>
    </html>
  );
}