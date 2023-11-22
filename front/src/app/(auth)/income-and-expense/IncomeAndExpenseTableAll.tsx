import { MemoPopover } from "@/app/components/MemoPopover";
import { IncomeAndExpense } from "@/app/util/types";
import { isMinus, toDateString } from "@/app/util/util";
import React from "react";
import { Card, Typography } from "@/app/materialTailwindExports";
import EditIcon from "../../components/EditIcon";
import DeleteIcon from "../../components/DeleteIcon";
import { getIncomeAndExpense } from "@/app/util/apiServer";
import BillingPopover from "../../components/BillingPopover";
import { IncomeAndExpenseTable } from "../../components/IncomeAndExpenseTable";

export const IncomeAndExpenseTableAll = async () => {
  const fetchData = await getIncomeAndExpense();

  return <IncomeAndExpenseTable fetchData={fetchData} />;
};
