import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "えふSaku",
    template: "%s | えふSaku",
  },
  description:
    "家計簿WEBサイトのえふSakuです。ユーザー間での精算（割り勘）機能があり、お金のやり取りを簡単に管理できます。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body
        className={`${inter.className} flex flex-col justify-between min-h-screen text-gray-700 bg-gray-50`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
