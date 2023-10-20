"use client";

import React from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

export const IncomeAndExpenseTabs = ({
  children,
  isIncome,
  isExpense,
}: {
  children?: React.ReactNode;
  isIncome: boolean;
  isExpense: boolean;
}) => {
  const [activeTab, setActiveTab] = React.useState(
    isIncome && !isExpense ? "income" : "expense"
  );

  let data: { label: string; value: string; borderColor: string }[] = [];

  const incomeData = {
    label: "収入",
    value: "income",
    borderColor: "border-blue-500",
  };

  const expenseData = {
    label: "支出",
    value: "expense",
    borderColor: "border-red-500",
  };

  if (isIncome) {
    data = [...data, incomeData];
  }
  if (isExpense) {
    data = [...data, expenseData];
  }

  const currentBorderColor =
    data.find((item) => item.value === activeTab)?.borderColor || "";

  const childArray = React.Children.toArray(children);

  return (
    <Tabs value={activeTab} className="overflow-visible">
      <TabsHeader
        className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
        indicatorProps={{
          className: `bg-transparent border-b-2 shadow-none rounded-none ${currentBorderColor}`,
        }}
      >
        {data.map(({ label, value }) => (
          <Tab
            key={value}
            value={value}
            onClick={() => setActiveTab(value)}
            className={activeTab === value ? "text-gray-900" : ""}
          >
            {label}
          </Tab>
        ))}
      </TabsHeader>
      <TabsBody className="mt-6 overflow-visible">
        {data.map((item, index) => (
          <TabPanel key={data[index].value} value={data[index].value}>
            {childArray[index]}
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
  );
};
