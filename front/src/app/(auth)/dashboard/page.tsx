import { getIncomeAndExpenseMonthlyTotal } from "@/app/util/apiServer";
import Dashboard from "./Dashboard";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "ダッシュボード",
};

const Page = async () => (
  <>
    <Dashboard
      incomeAndExpenseMonthlyTotal={await getIncomeAndExpenseMonthlyTotal()}
    />
  </>
);

export default Page;
