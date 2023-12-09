import Logo from "../components/Logo";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 left-0 z-10 p-1 text-gray-600 border-b border-green-500  bg-gray-50">
        <Logo />
      </header>
      <main className="flex-grow flex flex-col items-center justify-center">
        {children}
      </main>
    </>
  );
}
