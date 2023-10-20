import Header from "@/app/components/Header";
import { Suspense } from "react";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-grow container mx-auto p-10 max-w-screen-2xl">
        {children}
      </main>
    </>
  );
}
