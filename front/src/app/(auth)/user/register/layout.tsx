import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ユーザー登録",
  description: "ユーザー登録画面です。",
};

export default function UserRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
