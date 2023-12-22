import { getIncomeAndExpenseMonthlyTotal } from "@/app/util/apiServer";
import Dashboard from "./Dashboard";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "ダッシュボード",
};

const Page = async () => {
  const incomeAndExpenseMonthlyTotal = await getIncomeAndExpenseMonthlyTotal();
  return (
    <Dashboard incomeAndExpenseMonthlyTotal={incomeAndExpenseMonthlyTotal} />
  );
};

export default Page;
