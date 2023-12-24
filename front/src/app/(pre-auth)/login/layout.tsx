import PreAuthHeader from "@/app/components/PreAuthHeader";

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
