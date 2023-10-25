import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import UserProvider from "./context/UserProvider";
import Footer from "./components/Footer";
import { cookies } from "next/headers";
import AlertProvider from "./context/AlertProvider";

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
  const cookieStore = cookies();
  const token = cookieStore.get("jwt")?.value ?? "";

  return (
    <html lang="ja">
      <body
        className={`${inter.className} flex flex-col justify-between min-h-screen bg-gray-50`}
      >
        <UserProvider token={token}>
          {children}
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
