import { Metadata } from "next";
import { Setting } from "./Setting";
export const metadata: Metadata = {
  title: "設定",
};
const Page = () => (
  <>
    <Setting />
  </>
);

export default Page;
