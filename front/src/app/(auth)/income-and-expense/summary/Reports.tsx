"use client";

import { IncomeAndExpense } from "@/app/util/types";
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

export const MonthlyExpenseChart = ({
  fetchData,
}: {
  fetchData: IncomeAndExpense[];
}) => {
  const data = [
    { month: "1月", expense: 2400 },
    { month: "2月", expense: 2210 },
    { month: "3月", expense: 2290 },
    { month: "4月", expense: 2000 },
    { month: "5月", expense: 2181 },
    { month: "6月", expense: 2500 },
    { month: "7月", expense: 2100 },
  ];

  return (
    <>
      <h2 className="mb-4 text-xl font-bold">月間経費</h2>
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <div className="absolute top-0 left-0 w-full h-full">
          <ResponsiveContainer>
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#67b7dc"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};
