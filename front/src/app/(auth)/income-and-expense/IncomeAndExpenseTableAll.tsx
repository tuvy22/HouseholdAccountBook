import React from "react";

import {
  getIncomeAndExpense,
  getIncomeAndExpenseMaxPage,
} from "@/app/util/apiServer";

import { IncomeAndExpenseTable } from "../../components/IncomeAndExpenseTable";

import PaginationHandler from "./PaginationHandler";

export const IncomeAndExpenseTableAll = async ({ page }: { page: string }) => {
  const fetchData = await getIncomeAndExpense(page);
  const maxPage = await getIncomeAndExpenseMaxPage();

  return (
    <>
      <PaginationHandler page={page} maxPage={maxPage}>
        <IncomeAndExpenseTable tableData={fetchData} />
      </PaginationHandler>
    </>
  );
};
