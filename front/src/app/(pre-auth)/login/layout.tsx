import Logo from "@/app/components/Logo";
import PreAuthHeader from "@/app/components/PreAuthHeader";
import { Button } from "@/app/materialTailwindExports";
import Link from "next/link";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PreAuthHeader
        buttonLink={"/user-register"}
        buttonName={"アカウントをお持ちではない方はこちら"}
      />
      <main className="flex-1 flex flex-col items-center justify-center">
        {children}
      </main>
    </>
  );
}
