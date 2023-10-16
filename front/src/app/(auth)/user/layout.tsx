import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ユーザー一覧",
  description: "ユーザーの一覧画面です。",
};

export default function UserRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
