import { Metadata } from "next";
import { Register } from "./Register";
export const metadata: Metadata = {
  title: "アカウント作成",
};

const Page = () => (
  <>
    <Register />
  </>
);

export default Page;
