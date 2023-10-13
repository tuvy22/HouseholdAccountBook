import Header from "@/app/components/Header";
import { Suspense } from "react";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <Header />
      </Suspense>
      <main className="flex-grow flex flex-col bg-gray-50">{children}</main>
    </>
  );
}
