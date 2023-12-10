"use client";

import { IncomeAndExpenseTabs } from "../../components/IncomeAndExpenseTabs";
import CategoryList from "./CategoryList";

export function Category() {
  return (
    <div className="w-full max-w-sm mx-auto">
      <IncomeAndExpenseTabs isIncome={true} isExpense={true}>
        <CategoryList isExpense={false} />
        <CategoryList isExpense={true} />
      </IncomeAndExpenseTabs>
    </div>
  );
}
