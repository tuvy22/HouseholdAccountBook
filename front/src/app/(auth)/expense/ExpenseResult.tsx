import { Expense } from "@/app/util/types";
import { ExpenseTable } from "./ExpenseTable";
import { Suspense } from "react";

export const ExpenseResult = async () => {
  const fetchData: () => Promise<Expense[]> = async () => {
    const res = await fetch("http://localhost:8080/api/localhost/expenses", {
      cache: "no-store",
    });
    return res.json();
  };
  const data = await fetchData();
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ExpenseTable fetchData={data} />
    </Suspense>
  );
};
