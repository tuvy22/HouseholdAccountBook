import Header from "@/app/components/Header";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <UserProvider> */}
      <Header />
      <main className="flex-grow flex flex-col bg-gray-50">{children}</main>
      {/* </UserProvider> */}
    </>
  );
}
