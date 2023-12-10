import { MemoPopover } from "@/app/components/MemoPopover";
import { IncomeAndExpense } from "@/app/util/types";
import { toDateString } from "@/app/util/util";
import { Card } from "@/app/materialTailwindExports";
import EditIcon from "../EditIcon";
import IncomeAndExpenseDeleteIcon from "../IncomeAndExpenseDeleteIcon";
import BillingPopover from "../BillingPopover";
import { CheckedItems } from "../../(auth)/liquidation/search-result/LiquidationSearchResult";

import TableThTypography from "./TableThTypography";
import TableThCheckBox from "./TableThCheckBox";
import TableTypography from "./TableTypography";
import TableTdDate from "./TableTdDate";
import TableTdCheckbox from "./TableTdCheckbox";
import TableTd from "./TableTd";
import TableTdAmount from "./TableTdAmount";
import React from "react";

export const IncomeAndExpenseTable = ({
  tableData,
  isLiquidation = false,
  loginUserId = "",
  targetUserId = "",
  checkedItems = {},
  handleCheckboxChange = () => {},
  allCheckBox = true,
  handleAllCheckBoxChange = () => {},
}: {
  tableData: IncomeAndExpense[];
  isLiquidation?: boolean;
  loginUserId?: string;
  targetUserId?: string;
  checkedItems?: CheckedItems;
  handleCheckboxChange?: (id: number) => void;
  allCheckBox?: boolean;
  handleAllCheckBoxChange?: (check: boolean) => void;
}) => {
  let previousDate: Date;
  return (
    <>
      {tableData.length > 0 ? (
        <Card className="my-3">
          <table className="text-left">
            {isLiquidation ? (
              <>
                {/* デスクトップ表示 */}
                <thead className="hidden md:table-header-group">
                  <tr>
                    <TableThCheckBox
                      allCheckBox={allCheckBox}
                      handleAllCheckBoxChange={handleAllCheckBoxChange}
                    />
                    <TableThTypography>{"登録・支払"} </TableThTypography>
                    <TableThTypography>{"立替"} </TableThTypography>
                    <TableThTypography>{"区分"}</TableThTypography>
                    <TableThTypography> {"金額"}</TableThTypography>
                    <TableThTypography addClassName="w-[40%]">
                      {"メモ"}
                    </TableThTypography>
                  </tr>
                </thead>

                {/* スマホ表示 */}
                <thead className="table-header-group md:hidden">
                  <tr>
                    <TableThCheckBox
                      rowSpan={2}
                      allCheckBox={allCheckBox}
                      handleAllCheckBoxChange={handleAllCheckBoxChange}
                    />

                    <TableThTypography boderBottom="">
                      {"登録・支払"}
                    </TableThTypography>
                    <TableThTypography boderBottom="">
                      {"立替"}
                    </TableThTypography>
                    <TableThTypography rowSpan={2} addClassName="w-12">
                      {"メモ"}
                    </TableThTypography>
                  </tr>
                  <tr>
                    <TableThTypography>{"区分"}</TableThTypography>
                    <TableThTypography> {"金額"}</TableThTypography>
                  </tr>
                </thead>
              </>
            ) : (
              <>
                {/* デスクトップ表示 */}
                <thead className="hidden md:table-header-group">
                  <tr>
                    <TableThTypography>{"登録・支払"} </TableThTypography>
                    <TableThTypography>{"立替"} </TableThTypography>
                    <TableThTypography>{"区分"}</TableThTypography>
                    <TableThTypography> {"金額"}</TableThTypography>
                    <TableThTypography addClassName="w-[40%]">
                      {"メモ"}
                    </TableThTypography>
                    <TableThTypography addClassName="w-24">
                      {""}
                    </TableThTypography>
                  </tr>
                </thead>

                {/* スマホ表示 */}
                <thead className="table-header-group md:hidden">
                  <tr>
                    <TableThTypography boderBottom="">
                      {"登録・支払"}
                    </TableThTypography>
                    <TableThTypography boderBottom="">
                      {"立替"}
                    </TableThTypography>
                    <TableThTypography rowSpan={2} addClassName="w-12">
                      {"メモ"}
                    </TableThTypography>
                    <TableThTypography rowSpan={2} addClassName="w-12">
                      {""}
                    </TableThTypography>
                  </tr>
                  <tr>
                    <TableThTypography>{"区分"}</TableThTypography>
                    <TableThTypography> {"金額"}</TableThTypography>
                  </tr>
                </thead>
              </>
            )}

            <tbody>
              {tableData.map((incomeAndExpense: IncomeAndExpense, index) => (
                <React.Fragment key={index}>
                  {incomeAndExpense.date !== previousDate && (
                    <>
                      {/* デスクトップ表示 */}
                      <tr className="hidden md:table-row bg-green-50">
                        <TableTdDate colSpan={6}>
                          {toDateString(new Date(incomeAndExpense.date))}
                        </TableTdDate>
                      </tr>

                      {/* スマホ表示 */}
                      <tr className="table-row md:hidden bg-green-50">
                        <TableTdDate colSpan={4}>
                          {toDateString(new Date(incomeAndExpense.date))}
                        </TableTdDate>
                      </tr>
                    </>
                  )}

                  {(() => {
                    if (incomeAndExpense.date !== previousDate) {
                      previousDate = incomeAndExpense.date;
                    }

                    return (
                      <>
                        {/* デスクトップ表示 */}
                        <tr className="hidden md:table-row break-all">
                          {isLiquidation && (
                            <TableTdCheckbox
                              checkedItems={checkedItems}
                              incomeAndExpense={incomeAndExpense}
                              handleCheckboxChange={handleCheckboxChange}
                            />
                          )}
                          <TableTd>
                            <TableTypography>
                              {incomeAndExpense.registerUserName}
                            </TableTypography>
                          </TableTd>
                          <TableTd>
                            <BillingPopover
                              incomeAndExpense={incomeAndExpense}
                              notBgGrayUserId={
                                incomeAndExpense.registerUserID === loginUserId
                                  ? targetUserId
                                  : loginUserId
                              }
                            />
                          </TableTd>
                          <TableTd>
                            <TableTypography>
                              {incomeAndExpense.category}
                            </TableTypography>
                          </TableTd>
                          <TableTdAmount amount={incomeAndExpense.amount} />
                          <TableTd>
                            <TableTypography>
                              {incomeAndExpense.memo}
                            </TableTypography>
                          </TableTd>
                          {!isLiquidation && (
                            <TableTd>
                              <div className="flex flex-wrap justify-end gap-3">
                                <EditIcon incomeAndExpense={incomeAndExpense} />
                                <IncomeAndExpenseDeleteIcon
                                  incomeAndExpense={incomeAndExpense}
                                />
                              </div>
                            </TableTd>
                          )}
                        </tr>

                        {/* スマホ表示 */}
                        <tr className="md:hidden break-all">
                          {isLiquidation && (
                            <TableTdCheckbox
                              checkedItems={checkedItems}
                              incomeAndExpense={incomeAndExpense}
                              handleCheckboxChange={handleCheckboxChange}
                              rowSpan={2}
                            />
                          )}
                          <TableTd boderBottom="">
                            <TableTypography>
                              {incomeAndExpense.registerUserName}
                            </TableTypography>
                          </TableTd>
                          <TableTd boderBottom="">
                            <BillingPopover
                              incomeAndExpense={incomeAndExpense}
                              notBgGrayUserId={
                                incomeAndExpense.registerUserID === loginUserId
                                  ? targetUserId
                                  : loginUserId
                              }
                            />
                          </TableTd>

                          <TableTd rowSpan={2}>
                            {incomeAndExpense.memo.length >= 1 && (
                              <MemoPopover
                                content={incomeAndExpense.memo}
                                buttonText="表示"
                              />
                            )}
                          </TableTd>

                          {!isLiquidation && (
                            <TableTd rowSpan={2}>
                              <div className="flex flex-col flex-wrap gap-3 items-end">
                                <EditIcon incomeAndExpense={incomeAndExpense} />
                                <IncomeAndExpenseDeleteIcon
                                  incomeAndExpense={incomeAndExpense}
                                />
                              </div>
                            </TableTd>
                          )}
                        </tr>
                        <tr className="table-row md:hidden break-all">
                          <TableTd>
                            <TableTypography>
                              {incomeAndExpense.category}
                            </TableTypography>
                          </TableTd>
                          <TableTdAmount amount={incomeAndExpense.amount} />
                        </tr>
                      </>
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
