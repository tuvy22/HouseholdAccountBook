import Header from "@/app/components/Header";

import UserProvider from "../context/UserProvider";
import { AlertProvider } from "../context/AlertProvider";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <>
        <Header />
        <main className="flex-grow container mx-auto flex flex-col py-7 px-2 ">
          <AlertProvider>{children}</AlertProvider>
        </main>
      </>
    </UserProvider>
  );
}
