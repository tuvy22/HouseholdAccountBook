import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import UserProvider from "./context/UserProvider";
import Footer from "./components/Footer";
import { cookies } from "next/headers";

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
  const userId = cookieStore.get("userId")?.value ?? "";

  return (
    <html lang="ja">
      <body className={inter.className}>
        <UserProvider userId={userId}>
          <div className="flex flex-col justify-between min-h-screen">
            {children}
            <Footer />
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
