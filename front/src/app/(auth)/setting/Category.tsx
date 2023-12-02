"use client";

import { IncomeAndExpenseTabs } from "../income-and-expense/IncomeAndExpenseTabs";
import CategoryList from "./CategoryList";

export function Category() {
  return (
    <IncomeAndExpenseTabs isIncome={true} isExpense={true}>
      <CategoryList isExpense={false} />
      <CategoryList isExpense={true} />
    </IncomeAndExpenseTabs>
  );
}
