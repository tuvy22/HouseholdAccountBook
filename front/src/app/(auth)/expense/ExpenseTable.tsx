"use client";

import { PopoverAnimation } from "@/app/components/Popover";
import { Expense } from "@/app/util/types";
import { Card, Typography } from "@material-tailwind/react";
import { useState } from "react";

const TABLE_HEAD = ["日付", "支払い", "区分", "金額", "メモ"];

export const ExpenseTable = ({ fetchData }: { fetchData: Expense[] }) => {
  return (
    <div className="mt-6">
      {fetchData.length > 0 ? (
        <Card className="h-full w-full overflow-scroll">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fetchData.map((expense: Expense, index) => (
                <tr key={index} className="even:bg-blue-gray-50/50">
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {expense.date}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {expense.registerUserId}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {expense.category}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {expense.amount}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <div className="hidden md:block">
                      {/* デスクトップサイズでの  表示 */}
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {expense.memo}
                      </Typography>
                    </div>
                    <div className="md:hidden">
                      {/* スマホサイズでの表示 */}
                      {expense.memo.length >= 10 ? (
                        <PopoverAnimation
                          content={expense.memo}
                          buttonText="表示"
                        />
                      ) : (
                        <Typography>{expense.memo}</Typography>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <span>データは存在しません。</span>
      )}
    </div>
  );
};
