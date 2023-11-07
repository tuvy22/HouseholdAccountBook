import { Metadata } from "next";
import { IncomeAndExpenseForm } from "./IncomeAndExpenseForm";
import { IncomeAndExpenseTable } from "./IncomeAndExpenseTable";
import { Suspense } from "react";
import { Spinner } from "@/app/materialTailwindExports";
export const metadata: Metadata = {
  title: "家計簿一覧",
};
const Page = () => (
  <>
    <IncomeAndExpenseForm />
    <Suspense fallback={<Spinner className="m-auto" />}>
      <IncomeAndExpenseTable />
    </Suspense>
  </>
);

export default Page;
