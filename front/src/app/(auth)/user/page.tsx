import { Metadata } from "next";
import { UserResult } from "./UserResult";
export const metadata: Metadata = {
  title: "ユーザー一覧",
};
const Page = async () => {
  return (
    <div className="container mx-auto p-4 md:p-10 max-w-screen-2xl">
      <UserResult />
    </div>
  );
};

export default Page;
