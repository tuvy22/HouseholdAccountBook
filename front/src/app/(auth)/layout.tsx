import Header from "@/app/components/Header";
import { cookies } from "next/headers";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const userId = cookieStore.get("userId")?.value ?? "";
  return (
    <>
      <Header userId={userId} />
      <main className="flex-grow flex items-center justify-center bg-gray-50">
        {children}
      </main>
    </>
  );
}
