import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auction Hub",
  description:
    "Auction-Hub is a real-time auction platform where users can bid on items, manage listings, and track auction activity seamlessly. Featuring live bidding powered by WebSocket technology, user authentication, and intuitive item management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Footer />
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
