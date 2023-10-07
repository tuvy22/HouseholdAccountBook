import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import UserProvider from "./context/UserProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "家計簿WEB",
  description: "家計簿WEBです。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userInfo = {
    name: "",
    age: 0,
  };
  return (
    <html lang="ja">
      <body className={inter.className}>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
