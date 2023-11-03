import { Metadata } from "next";
import { IncomeAndExpenseForm } from "./IncomeAndExpenseForm";
import { IncomeAndExpenseTable } from "./IncomeAndExpenseTable";
export const metadata: Metadata = {
  title: "家計簿一覧",
};
const Page = () => (
  <>
    <IncomeAndExpenseForm />
    <IncomeAndExpenseTable />
  </>
);

export default Page;
