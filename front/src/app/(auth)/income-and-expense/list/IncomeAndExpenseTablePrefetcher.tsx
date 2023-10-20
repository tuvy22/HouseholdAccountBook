import { IncomeAndExpense } from "@/app/util/types";
import { IncomeAndExpenseTable } from "./IncomeAndExpenseTable";
import { Suspense } from "react";
import { getIncomeAndExpense } from "@/app/util/api";

export const IncomeAndExpenseTablePrefetcher = async () => {
  return <IncomeAndExpenseTable fetchData={await getIncomeAndExpense()} />;
};
