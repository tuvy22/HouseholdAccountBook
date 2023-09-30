import LogoutHeader from "@/components/LogoutHeader";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LogoutHeader />
      {children}
    </>
  );
}
