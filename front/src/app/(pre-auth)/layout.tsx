import Header from "../components/Header";
import Logo from "../components/Logo";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 left-0 right-0 p-1 text-gray-600 border-b border-green-500">
        <Logo />
      </header>
      <main className="flex-grow flex flex-col items-center justify-center">
        {children}
      </main>
    </>
  );
}
