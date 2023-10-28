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

export const IncomeAndExpenseMonthlyChart = async ({
  data,
}: {
  data: IncomeAndExpenseMonthlyTotal[];
}) => {
  return (
    <>
      <h2 className="mb-4 text-xl font-bold">月別推移</h2>
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <div className="absolute top-0 left-0 w-full h-full">
          <ResponsiveContainer>
            <LineChart
              data={data}
              margin={{ top: 20, right: 10, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="yearMonth" />
              <YAxis tickFormatter={(value) => `${value}円`} />

              <Tooltip />
              <Legend />
              <Line
                type="linear"
                dataKey="totalAmount"
                stroke="#67b7dc"
                activeDot={{ r: 8 }}
                name="残高"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};
