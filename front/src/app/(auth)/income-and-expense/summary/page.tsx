import { getIncomeAndExpense } from "@/app/util/api";
import { MonthlyExpenseChart } from "./Reports";

const Page = async () => (
  <>
    <MonthlyExpenseChart fetchData={await getIncomeAndExpense()} />
  </>
);

export default Page;
