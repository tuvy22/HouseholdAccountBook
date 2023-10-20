import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "集計画面",
  description: "集計画面です。",
};

export default function ExpenseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
