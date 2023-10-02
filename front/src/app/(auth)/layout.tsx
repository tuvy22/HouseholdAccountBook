import LogoutHeader from "@/app/components/LogoutHeader";

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
