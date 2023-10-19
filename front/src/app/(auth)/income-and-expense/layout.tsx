import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "家計簿一覧",
  description: "家計簿一覧です。",
};

export default function ExpenseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto p-10 max-w-screen-2xl">{children}</div>
  );
}
