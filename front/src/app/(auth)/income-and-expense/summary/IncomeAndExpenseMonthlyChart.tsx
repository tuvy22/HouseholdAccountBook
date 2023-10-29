"use client";

import { IncomeAndExpenseMonthlyTotal } from "@/app/util/types";
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

export const IncomeAndExpenseMonthlyChart = ({
  data,
}: {
  data: IncomeAndExpenseMonthlyTotal[];
}) => {
  const handlePointClick = (data: CategoricalChartState) => {
    console.log(data.activeLabel);
  };

  return (
    <>
      {/* <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
      <div className="absolute top-0 left-0 w-full h-full"> */}
      <ResponsiveContainer height={400}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 10, left: 10, bottom: 10 }}
          onClick={handlePointClick}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="yearMonth" dy={15} />
          <YAxis tickFormatter={(value) => `${value}円`} dx={-15} />

          <Tooltip />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ marginTop: -20, marginRight: -10 }}
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
      {/* </div>
    </div> */}
    </>
  );
};
