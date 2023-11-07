import { Metadata } from "next";
import UserInvite from "./UserInvite";

export const metadata: Metadata = {
  title: "グループへの招待",
};

const Page = () => (
  <>
    <UserInvite />
  </>
);

export default Page;
