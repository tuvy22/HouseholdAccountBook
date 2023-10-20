import { IncomeAndExpenseForm } from "./IncomeAndExpenseForm";
import { IncomeAndExpenseTablePrefetcher } from "./IncomeAndExpenseTablePrefetcher";

const Page = async () => (
  <>
    <IncomeAndExpenseForm />
    <IncomeAndExpenseTablePrefetcher />
  </>
);

export default Page;
