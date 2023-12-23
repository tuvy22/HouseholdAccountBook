"use client";

import { IncomeAndExpenseMonthlyChart } from "./IncomeAndExpenseMonthlyChart";
import { IncomeAndExpensePieChart } from "./IncomeAndExpensePieChart";
import { CategoricalChartState } from "recharts/types/chart/generateCategoricalChart";
import { useState } from "react";
import { toYearMonthString } from "@/app/util/util";
import { IncomeAndExpenseMonthlyTotal } from "@/app/util/types";
const Dashboard = ({
  incomeAndExpenseMonthlyTotal,
}: {
  incomeAndExpenseMonthlyTotal: IncomeAndExpenseMonthlyTotal[] | undefined;
}) => {
  const [yearMonth, setYearMonth] = useState(toYearMonthString(new Date()));
  const handlePointClick = (data: CategoricalChartState) => {
    if (data) {
      setYearMonth(data.activeLabel ? data.activeLabel : "");
    }
  };

  return (
    <>
      {incomeAndExpenseMonthlyTotal &&
      incomeAndExpenseMonthlyTotal.length > 0 ? (
        <div className="grid grid-cols-[1fr] md:grid-cols-[1fr_1fr] grid-rows-[auto_auto_auto] md:grid-rows-[auto_auto] justify-items-center items-center gap-0 md:gap-4">
          <div className="w-full md:col-span-2">
            <IncomeAndExpenseMonthlyChart
              incomeAndExpenseMonthlyTotal={incomeAndExpenseMonthlyTotal}
              handlePointClick={handlePointClick}
            />
          </div>
          <div className="w-full md:col-span-1 col-span-2">
            <IncomeAndExpensePieChart yearMonth={yearMonth} isMinus={false} />
          </div>
          <div className="w-full md:col-span-1 col-span-2">
            <IncomeAndExpensePieChart yearMonth={yearMonth} isMinus={true} />
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col justify-center items-center">
          データは存在しません。
        </div>
      )}
    </>
  );
};

export default Dashboard;
