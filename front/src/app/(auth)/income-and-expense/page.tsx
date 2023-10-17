import { IncomeAndExpenseForm } from "./IncomeAndExpenseForm";
import { IncomeAndExpenseResult } from "./IncomeAndExpenseResult";

const Page = async () => (
  <div className="container mx-auto p-10 max-w-screen-2xl">
    <IncomeAndExpenseForm />
    <IncomeAndExpenseResult />
  </div>
);

export default Page;
