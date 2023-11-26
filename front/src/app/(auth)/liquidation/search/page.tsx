import { Metadata } from "next";
import LiquidationSearch from "./LiquidationSearch";

export const metadata: Metadata = {
  title: "清算",
};

const Page = () => <LiquidationSearch />;

export default Page;
