import { IncomeAndExpense } from "@/app/util/types";
import { IncomeAndExpenseTable } from "./IncomeAndExpenseTable";
import { Suspense } from "react";

export const IncomeAndExpenseResult = async () => {
  const fetchData: () => Promise<IncomeAndExpense[]> = async () => {
    const res = await fetch(
      "http://localhost:8080/api/localhost/incomeAndExpense",
      {
        cache: "no-store",
      }
    );
    return res.json();
  };
  const data = await fetchData();
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <IncomeAndExpenseTable fetchData={data} />
    </Suspense>
  );
};
