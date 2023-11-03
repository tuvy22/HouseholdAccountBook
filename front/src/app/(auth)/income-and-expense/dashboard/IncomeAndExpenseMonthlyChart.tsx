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
  const [startYearMonth, setStartYearMonth] = useState(
    getPreviousYearMonth(toYearMonthString(new Date()))
  );
  const [endYearMonth, setEndYearMonth] = useState(
    toYearMonthString(new Date())
  );

  const [data, setData] = useState<IncomeAndExpenseMonthlyTotal[]>([]);
  const [isPre, setIsPre] = useState(false);
  const [isNext, setIsNext] = useState(false);
  const [minStartYearMonth, setMinStartYearMonth] = useState("");
  const [maxEndYearMonth, setMaxEndYearMonth] = useState("");

  const next = () => {
    if (maxEndYearMonth < getNextYearMonth(endYearMonth)) {
      setStartYearMonth(getPreviousYearMonth(maxEndYearMonth));
      setEndYearMonth(maxEndYearMonth);
    } else {
      setStartYearMonth(endYearMonth);
      setEndYearMonth(getNextYearMonth(endYearMonth));
    }
  };

  const prev = () => {
    if (getPreviousYearMonth(startYearMonth) < minStartYearMonth) {
      setStartYearMonth(minStartYearMonth);
      setEndYearMonth(getNextYearMonth(minStartYearMonth));
    } else {
      setStartYearMonth(getPreviousYearMonth(startYearMonth));
      setEndYearMonth(startYearMonth);
    }
  };

  useEffect(() => {
    setData(
      incomeAndExpenseMonthlyTotal.filter(
        (list) =>
          list.yearMonth >= startYearMonth && list.yearMonth <= endYearMonth
      )
    );
    setIsPre(
      incomeAndExpenseMonthlyTotal.some(
        (list) => list.yearMonth < startYearMonth
      )
    );
    setIsNext(
      incomeAndExpenseMonthlyTotal.some((list) => list.yearMonth > endYearMonth)
    );

    if (incomeAndExpenseMonthlyTotal.length > 0) {
      setMinStartYearMonth(incomeAndExpenseMonthlyTotal[0].yearMonth);
      setMaxEndYearMonth(
        incomeAndExpenseMonthlyTotal[incomeAndExpenseMonthlyTotal.length - 1]
          .yearMonth
      );
    }
  }, [startYearMonth, endYearMonth, incomeAndExpenseMonthlyTotal]);
  return (
    <>
      <Typography variant="h2" className="text-xl">
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
            margin={{ top: 0, right: 10, left: 40, bottom: 10 }}
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
