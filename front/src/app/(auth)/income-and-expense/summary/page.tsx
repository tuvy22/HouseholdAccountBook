import { getIncomeAndExpenseMonthlyTotal } from "@/app/util/api";
import { IncomeAndExpenseMonthlyChart } from "./IncomeAndExpenseMonthlyChart";
import IncomeAndExpensePieChart from "./IncomeAndExpensePieChart";
const Page = async () => (
  <>
    <h2 className="mb-4 text-xl font-bold">月別推移</h2>
    <IncomeAndExpenseMonthlyChart
      data={await getIncomeAndExpenseMonthlyTotal()}
    />
    <IncomeAndExpensePieChart />
  </>
);

export default Page;
