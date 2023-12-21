import { getIncomeAndExpenseMonthlyTotal } from "@/app/util/apiServer";
import Dashboard from "./Dashboard";
import { Metadata } from "next";
import DashboardServer from "./DashboardServer";
export const metadata: Metadata = {
  title: "ダッシュボード",
};

const Page = async () => (
  <>
    <DashboardServer />
  </>
);

export default Page;
