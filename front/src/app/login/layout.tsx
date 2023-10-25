import type { Metadata } from "next";
import AlertProvider from "../context/AlertProvider";

export const metadata: Metadata = {
  title: "ログイン",
  description: "ログイン画面です。",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-grow flex items-center justify-center">
      {children}
    </main>
  );
}
