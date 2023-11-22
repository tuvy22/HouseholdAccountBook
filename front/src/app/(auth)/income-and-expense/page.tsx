import { Metadata } from "next";
import { IncomeAndExpenseForm } from "./IncomeAndExpenseForm";
import { IncomeAndExpenseTableAll } from "./IncomeAndExpenseTableAll";
import { Suspense } from "react";
import { Spinner } from "@/app/materialTailwindExports";
export const metadata: Metadata = {
  title: "家計簿一覧",
};
const Page = () => (
  <>
    <IncomeAndExpenseForm />
    <Suspense fallback={<Spinner className="m-auto" />}>
      <IncomeAndExpenseTableAll />
    </Suspense>
  </>
);

export default Page;
