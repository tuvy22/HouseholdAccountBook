import { getIncomeAndExpenseMonthlyTotal } from "@/app/util/apiServer";

import { Metadata } from "next";
import Liquidation from "./Liquidation";
export const metadata: Metadata = {
  title: "清算",
};

const Page = async () => (
  <>
    <Liquidation />
  </>
);

export default Page;
