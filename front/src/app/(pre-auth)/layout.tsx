import type { Metadata } from "next";
import AlertProvider from "../context/AlertProvider";

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
