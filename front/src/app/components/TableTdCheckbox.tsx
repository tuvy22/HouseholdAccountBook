import React from "react";
import { Checkbox, Typography } from "../materialTailwindExports";
import TableTd from "./TableTd";
import { CheckedItems } from "../(auth)/liquidation/search-result/LiquidationSearchResult";
import { IncomeAndExpense } from "../util/types";

export default function TableTdCheckbox({
  rowSpan = 1,
  checkedItems,
  incomeAndExpense,
  handleCheckboxChange,
}: {
  rowSpan?: number;
  checkedItems: CheckedItems;
  incomeAndExpense: IncomeAndExpense;
  handleCheckboxChange: (id: number) => void;
}) {
  return (
    <TableTd rowSpan={rowSpan}>
      <Checkbox
        checked={checkedItems[incomeAndExpense.id] || false}
        onChange={() => handleCheckboxChange(incomeAndExpense.id)}
        crossOrigin={undefined}
      />
    </TableTd>
  );
}
