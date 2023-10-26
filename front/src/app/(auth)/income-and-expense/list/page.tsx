import { Suspense } from "react";
import { IncomeAndExpenseForm } from "./IncomeAndExpenseForm";
import { IncomeAndExpenseTable } from "./IncomeAndExpenseTable";
import { Spinner } from "@/app/materialTailwindExports";

const Page = async () => (
  <>
    <Suspense fallback={<Spinner />}>
      <IncomeAndExpenseForm />
      <IncomeAndExpenseTable />
    </Suspense>
  </>
);

export default Page;
