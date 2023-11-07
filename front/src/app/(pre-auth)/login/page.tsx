import { Metadata } from "next";
import Login from "./Login";

export const metadata: Metadata = {
  title: "ログイン",
};

const Page = () => (
  <>
    <Login />
  </>
);

export default Page;
