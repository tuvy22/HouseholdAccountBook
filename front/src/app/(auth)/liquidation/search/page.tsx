import { Metadata } from "next";
import LiquidationSearch from "./LiquidationSearch";
import { User } from "@/app/util/types";
import UnavailablePage from "../UnavailablePage";
import { getGroupAllUser } from "@/app/util/apiServer";

export const metadata: Metadata = {
  title: "清算内容検索",
};

const Page = async () => {
  const groupUsers: User[] = await getGroupAllUser();

  return (
    <>
      {groupUsers && groupUsers.length > 1 ? (
        <LiquidationSearch />
      ) : (
        <UnavailablePage />
      )}
    </>
  );
};

export default Page;
