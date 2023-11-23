import { Metadata } from "next";
import Liquidation from "./Liquidation";

export const metadata: Metadata = {
  title: "清算",
};

const Page = () => <Liquidation />;

export default Page;
