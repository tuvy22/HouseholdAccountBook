import Header from "@/app/components/Header";
import AlertProvider from "../context/AlertProvider";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-grow container mx-auto flex flex-col py-7 ">
        <AlertProvider>{children}</AlertProvider>
      </main>
    </>
  );
}
