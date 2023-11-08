import { Metadata } from "next";
import Login from "./Login";
import { cookies } from "next/headers";
import { INVITE_COOKIE_TOKEN } from "@/app/util/constants";

export const metadata: Metadata = {
  title: "ログイン",
};

const Page = () => {
  const cookieStore = cookies();
  const isInvite = cookieStore.get(INVITE_COOKIE_TOKEN) ? true : false;

  return <Login isInvite={isInvite} />;
};

export default Page;
