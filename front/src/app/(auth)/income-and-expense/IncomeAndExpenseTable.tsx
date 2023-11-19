import { MemoPopover } from "@/app/components/MemoPopover";
import { IncomeAndExpense } from "@/app/util/types";
import { isMinus, toDateString } from "@/app/util/util";
import React from "react";
import { Card, Typography } from "@/app/materialTailwindExports";
import EditIcon from "../../components/EditIcon";
import DeleteIcon from "../../components/DeleteIcon";
import { getIncomeAndExpense } from "@/app/util/apiServer";
import BillingPopover from "./BillingPopover";

const TABLE_INFO = [
  { header: "登録", addClassName: "" },
  { header: "支払", addClassName: "" },
  { header: "区分", addClassName: "" },
  { header: "金額", addClassName: "" },
  { header: "メモ", addClassName: "w-[40%]" },
  { header: "", addClassName: "w-28" },
];

export const IncomeAndExpenseTable = async () => {
  const fetchData = await getIncomeAndExpense();
  let previousDate: Date;

  return (
    <>
      {fetchData.length > 0 ? (
        <Card className="mt-6">
          <table className="text-left">
            <thead>
              <tr>
                {TABLE_INFO.map((info, index) => (
                  <th
                    key={index}
                    className={`border-b border-blue-gray-100 bg-blue-gray-50 p-4 ${info.addClassName}`}
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {info.header}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fetchData.map((incomeAndExpense: IncomeAndExpense, index) => (
                <React.Fragment key={index}>
                  {incomeAndExpense.date !== previousDate && (
                    <>
                      <tr className="bg-green-50">
                        <td
                          className="p-4 whitespace-nowrap text-center border-b border-blue-gray-50"
                          colSpan={TABLE_INFO.length}
                        >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-green-700"
                          >
                            {toDateString(new Date(incomeAndExpense.date))}
                          </Typography>
                        </td>
                      </tr>
                    </>
                  )}

                  {(() => {
                    if (incomeAndExpense.date !== previousDate) {
                      previousDate = incomeAndExpense.date;
                    }

                    return (
                      <tr key={index} className="break-all">
                        <td className="p-2 md:p-4 border-b border-blue-gray-50">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {incomeAndExpense.registerUserId}
                          </Typography>
                        </td>
                        <td className="p-2 md:p-4 border-b border-blue-gray-50">
                          <div>
                            {incomeAndExpense.billingUsers.length > 1 ||
                            (incomeAndExpense.billingUsers.length == 1 &&
                              incomeAndExpense.billingUsers[0].userID !==
                                incomeAndExpense.registerUserId) ? (
                              <BillingPopover
                                incomeAndExpense={incomeAndExpense}
                              />
                            ) : (
                              <span>
                                {incomeAndExpense.billingUsers.length === 1
                                  ? incomeAndExpense.billingUsers[0].userID
                                  : ""}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-2 md:p-4 border-b border-blue-gray-50">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {incomeAndExpense.category}
                          </Typography>
                        </td>
                        <td
                          className={`p-2 md:p-4 border-b border-blue-gray-50 ${
                            isMinus(incomeAndExpense.amount)
                              ? "text-red-500"
                              : "text-blue-500"
                          }`}
                        >
                          <Typography variant="small" className="font-normal">
                            {`${incomeAndExpense.amount}円`}
                          </Typography>
                        </td>
                        <td className="p-2 md:p-4 border-b border-blue-gray-50">
                          <div className="hidden md:block">
                            {/* デスクトップサイズでの  表示 */}
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {incomeAndExpense.memo}
                            </Typography>
                          </div>
                          <div className="md:hidden">
                            {/* スマホサイズでの表示 */}
                            {incomeAndExpense.memo.length >= 10 ? (
                              <MemoPopover
                                content={incomeAndExpense.memo}
                                buttonText="表示"
                              />
                            ) : (
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {incomeAndExpense.memo}
                              </Typography>
                            )}
                          </div>
                        </td>

                        <td className="p-2 md:p-4 border-b border-blue-gray-50">
                          <div className="flex flex-col flex-wrap justify-center gap-3 md:flex-row">
                            <EditIcon incomeAndExpense={incomeAndExpense} />
                            <DeleteIcon incomeAndExpense={incomeAndExpense} />
                          </div>
                        </td>
                      </tr>
                    );
                  })()}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <div className="text-center">データは存在しません。</div>
      )}
    </>
  );
};
