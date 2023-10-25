import Header from "@/app/components/Header";
import { Suspense } from "react";
import { AlertValue, Alerts } from "../components/AlertCustoms";
import AlertProvider from "../context/AlertProvider";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-grow container mx-auto flex flex-col p-3">
        <AlertProvider>{children}</AlertProvider>
      </main>
    </>
  );
}
