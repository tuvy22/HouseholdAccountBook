"use client";

import {
  IncomeAndExpenseMonthlyCategory,
  IncomeAndExpenseMonthlyTotal,
} from "@/app/util/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CategoricalChartState } from "recharts/types/chart/generateCategoricalChart";
import { IconButton, Typography } from "@/app/materialTailwindExports";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useEffect, useState } from "react";
import {
  getNextYearMonth,
  getPreviousYearMonth,
  toYearMonthString,
} from "@/app/util/util";

export const IncomeAndExpenseMonthlyChart = ({
  incomeAndExpenseMonthlyTotal,
  handlePointClick,
}: {
  incomeAndExpenseMonthlyTotal: IncomeAndExpenseMonthlyTotal[];
  handlePointClick: (data: CategoricalChartState) => void;
}) => {
  const [endYearMonth, setEndYearMonth] = useState(
    toYearMonthString(new Date())
  );
  const [data, setData] = useState<IncomeAndExpenseMonthlyTotal[]>([]);
  const [isPre, setIsPre] = useState(false);
  const [isNext, setIsNext] = useState(false);

  const next = () => {
    setEndYearMonth(getNextYearMonth(endYearMonth));
  };

  const prev = () => {
    setEndYearMonth(getPreviousYearMonth(endYearMonth));
  };

  useEffect(() => {
    const start = getPreviousYearMonth(endYearMonth);
    const end = endYearMonth;
    setData(
      incomeAndExpenseMonthlyTotal.filter(
        (list) => list.yearMonth >= start && list.yearMonth <= end
      )
    );
    setIsPre(
      incomeAndExpenseMonthlyTotal.some((list) => list.yearMonth < start)
    );
    setIsNext(
      incomeAndExpenseMonthlyTotal.some((list) => list.yearMonth > end)
    );
  }, [endYearMonth, incomeAndExpenseMonthlyTotal]);
  return (
    <>
      <Typography variant="h2" className="pt-5 text-xl">
        残高推移
      </Typography>
      <div className="flex items-center gap-5">
        <IconButton
          size="sm"
          variant="outlined"
          onClick={prev}
          disabled={!isPre}
          className={!isPre ? "text-gray-500 border-gray-500" : ""}
        >
          <NavigateBeforeIcon strokeWidth={2} className="h-4 w-4" />
        </IconButton>
        <ResponsiveContainer height={250}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 10, left: 50, bottom: 10 }}
            onClick={handlePointClick}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="yearMonth" dy={15} />
            <YAxis tickFormatter={(value) => `${value}円`} dx={-10} />

            <Tooltip />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{
                marginTop: -20,
                marginRight: -10,
              }}
            />

            <Line
              type="linear"
              dataKey="totalAmount"
              stroke="#67b7dc"
              activeDot={{ r: 8 }}
              name="残高"
            />
          </LineChart>
        </ResponsiveContainer>
        <IconButton
          size="sm"
          variant="outlined"
          onClick={next}
          disabled={!isNext}
          className={!isNext ? "text-gray-500 border-gray-500" : ""}
        >
          <NavigateNextIcon strokeWidth={2} className="h-4 w-4" />
        </IconButton>
      </div>
    </>
  );
};
