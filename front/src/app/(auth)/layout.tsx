import LogoutHeader from "@/app/components/LogoutHeader";
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
      <LogoutHeader userId={userId} />
      {children}
    </>
  );
}
