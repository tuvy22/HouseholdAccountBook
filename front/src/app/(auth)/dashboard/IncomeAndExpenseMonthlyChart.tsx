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
import { Typography } from "@/app/materialTailwindExports";
import { useEffect, useState } from "react";
import {
  getNextYearMonth,
  getPreviousYearMonth,
  toYearMonthString,
} from "@/app/util/util";
import PreOrNextIcon from "./PreOrNextIcon";

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
      <div className="flex justify-center gap-4">
        <div className="md:hidden block">
          <PreOrNextIcon
            isPreIcon={true}
            morePreOrNext={isPre}
            clickFn={prev}
          />
        </div>
        <Typography variant="h2" className="text-xl text-center md:text-left">
          残高推移
        </Typography>
        <div className="md:hidden block">
          <PreOrNextIcon
            isPreIcon={false}
            morePreOrNext={isNext}
            clickFn={next}
          />
        </div>
      </div>
      <div className="flex items-center gap-5">
        <div className="hidden md:block">
          <PreOrNextIcon
            isPreIcon={true}
            morePreOrNext={isPre}
            clickFn={prev}
          />
        </div>
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
                marginTop: 0,
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
        <div className="hidden md:block">
          <PreOrNextIcon
            isPreIcon={false}
            morePreOrNext={isNext}
            clickFn={next}
          />
        </div>
      </div>
    </>
  );
};
