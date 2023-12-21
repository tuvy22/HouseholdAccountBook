import { getIncomeAndExpenseMonthlyTotal } from "@/app/util/apiServer";
import Dashboard from "./Dashboard";

export default async function DashboardServer() {
  const incomeAndExpenseMonthlyTotal = await getIncomeAndExpenseMonthlyTotal();
  return (
    <Dashboard incomeAndExpenseMonthlyTotal={incomeAndExpenseMonthlyTotal} />
  );
}
