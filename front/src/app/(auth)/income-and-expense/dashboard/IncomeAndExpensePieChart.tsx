"use client";

import { IncomeAndExpenseMonthlyCategory } from "@/app/util/types";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { scaleOrdinal } from "d3-scale";
import { useEffect, useState } from "react";
import { getIncomeAndExpenseMonthlyCategory } from "@/app/util/api";

export const IncomeAndExpensePieChart = ({
  yearMonth,
  isMinus,
}: {
  yearMonth: string;
  isMinus: boolean;
}) => {
  //カラーチャート（超える場合は繰り返す）
  const COLORS = [
    "#a1c4fd",
    "#c2e9fb",
    "#f3a0c2",
    "#fbc2eb",
    "#f6d365",
    "#fda085",
    "#84fab0",
    "#8fd3f4",
    "#a6c1ee",
    "#f68fa7",
    "#f6a6ff",
    "#96e6a1",
    "#d4fc79",
    "#ffecd2",
    "#fcb69f",
    "#c0c0aa",
    "#f093fb",
    "#f5576c",
    "#4facfe",
    "#00f2fe",
    "#43e97b",
    "#38f9d7",
    "#fa709a",
    "#fee140",
    "#9be15d",
    "#f66767",
    "#57c1e8",
    "#764ba2",
    "#fe977e",
    "#d4fc79",
  ];

  const [data, setData] = useState<IncomeAndExpenseMonthlyCategory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setData(await getIncomeAndExpenseMonthlyCategory(yearMonth, isMinus));
    };
    fetchData();
  }, [isMinus, yearMonth]);

  const colorScale = scaleOrdinal<string>()
    .domain(data.map((d) => d.category))
    .range(COLORS);

  return (
    <>
      <ResponsiveContainer height={500}>
        <PieChart>
          <Pie
            data={data}
            dataKey="categoryAmount"
            nameKey="category"
            startAngle={90}
            endAngle={-270}
            outerRadius={200}
            label={({ name, percent }) => {
              // 3%未満の場合はラベルを出力しない
              if (percent < 0.03) return null;

              return `${name} ${(percent * 100).toFixed(0)}%`;
            }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colorScale(entry.category) as string}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `${isMinus ? "-" : ""}${value}円`}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
};
