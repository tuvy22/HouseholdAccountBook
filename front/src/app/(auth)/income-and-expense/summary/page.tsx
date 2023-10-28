import { getIncomeAndExpenseMonthlyTotal } from "@/app/util/api";
import { IncomeAndExpenseMonthlyChart } from "./IncomeAndExpenseMonthlyChart";
const Page = async () => (
  <>
    <IncomeAndExpenseMonthlyChart
      data={await getIncomeAndExpenseMonthlyTotal()}
    />
  </>
);

export default Page;
