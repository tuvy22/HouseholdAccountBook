import type { Metadata } from "next";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-grow flex items-center justify-center">
      {children}
    </main>
  );
}
