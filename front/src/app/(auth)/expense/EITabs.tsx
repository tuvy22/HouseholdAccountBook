"use client";

import React from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

export const EITabs = ({ children }: { children?: React.ReactNode }) => {
  const [activeTab, setActiveTab] = React.useState("expense");
  const data = [
    {
      label: "収入",
      value: "income",
      borderColor: "border-blue-500",
    },
    {
      label: "支出",
      value: "expense",
      borderColor: "border-red-500",
    },
  ];
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
        <TabPanel key={data[0].value} value={data[0].value}>
          {childArray[0]}
        </TabPanel>
        <TabPanel key={data[1].value} value={data[1].value}>
          {childArray[1]}
        </TabPanel>
      </TabsBody>
    </Tabs>
  );
};
