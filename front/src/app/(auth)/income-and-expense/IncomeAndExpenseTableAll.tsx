import React from "react";

import { getIncomeAndExpense } from "@/app/util/apiServer";

import { IncomeAndExpenseTable } from "../../components/IncomeAndExpenseTable";

export const IncomeAndExpenseTableAll = async () => {
  const fetchData = await getIncomeAndExpense();

  return <IncomeAndExpenseTable fetchData={fetchData} />;
};
