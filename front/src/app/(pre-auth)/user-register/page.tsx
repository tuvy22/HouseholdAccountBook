import { Metadata } from "next";
import { Register } from "./Register";
import { cookies } from "next/headers";
import { INVITE_COOKIE_TOKEN } from "@/app/util/constants";
export const metadata: Metadata = {
  title: "アカウント作成",
};

const Page = () => {
  const cookieStore = cookies();
  const isInvite = cookieStore.get(INVITE_COOKIE_TOKEN) ? true : false;
  return <Register isInvite={isInvite} />;
};

export default Page;
