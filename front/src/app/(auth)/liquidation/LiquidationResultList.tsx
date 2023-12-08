import React, { useCallback, useEffect, useState } from "react";

import { Liquidation } from "@/app/util/types";
import { Button, Card, Typography } from "@/app/materialTailwindExports";
import { useRouter } from "next/navigation";
import { toDateString } from "@/app/util/util";
import { getLiquidations } from "@/app/util/apiServer";
import Link from "next/link";
import LiquidationFlow from "./LiquidationFlow";
import ClearIcon from "@mui/icons-material/Clear";
import LiquidationDeleteIcon from "@/app/components/LiquidationDeleteIcon";
import TableThTypography from "@/app/components/TableThTypography";
import TableTd from "@/app/components/TableTd";
import TableTypography from "@/app/components/TableTypography";

// const TABLE_INFO = [
//   { header: "清算日", addClassName: "" },
//   { header: "登録", addClassName: "" },
//   { header: "清算内容", addClassName: "" },
//   { header: "", addClassName: "w-28" },
// ];

export const LiquidationResultList = async () => {
  const fetchData = await getLiquidations();

  return (
    <>
      <div className="flex md:justify-between justify-center flex-col md:flex-row">
        <div>
          <Typography
            variant="h4"
            color="blue-gray"
            className="text-xl text-center md:text-left"
          >
            清算結果一覧
          </Typography>
        </div>
        <div className="mt-3 md:mt-0">
          <Link href="/liquidation/search">
            <Button
              variant="gradient"
              color="green"
              size="lg"
              className="w-full md:w-32"
            >
              {"清算追加"}
            </Button>
          </Link>
        </div>
      </div>

      {fetchData.length > 0 ? (
        <Card className="mt-3">
          <table className="text-left">
            {/* デスクトップ表示 */}
            <thead className="hidden md:table-header-group">
              <tr>
                <TableThTypography>{"清算日"} </TableThTypography>
                <TableThTypography>{"登録"} </TableThTypography>
                <TableThTypography>{"清算内容"} </TableThTypography>
                <TableThTypography>{""} </TableThTypography>
              </tr>
            </thead>

            {/* スマホ表示 */}
            <thead className="table-header-group md:hidden">
              <tr>
                <TableThTypography boderBottom="">{"清算日"}</TableThTypography>
                <TableThTypography boderBottom="">{"登録"} </TableThTypography>
                <TableThTypography rowSpan={2}>{""} </TableThTypography>
              </tr>
              <tr>
                <TableThTypography colSpan={2}>{"清算内容"} </TableThTypography>
              </tr>
            </thead>
            <tbody>
              {fetchData.map((liquidation: Liquidation, index) => {
                // billingUsersのamount合計を計算
                const totalAmount = liquidation.billingUsers.reduce(
                  (sum, user) =>
                    sum +
                    (liquidation.registerUserID === user.userID
                      ? user.amount
                      : -user.amount),
                  0
                );

                return (
                  <>
                    {/* デスクトップ表示 */}
                    <tr key={index} className="hidden md:table-row break-all">
                      <TableTd>
                        <TableTypography>
                          {toDateString(new Date(liquidation.date))}
                        </TableTypography>
                      </TableTd>
                      <TableTd>
                        <TableTypography>
                          {liquidation.registerUserName}
                        </TableTypography>
                      </TableTd>
                      <TableTd>
                        <LiquidationFlow
                          registerUserName={liquidation.registerUserName}
                          targetUserName={liquidation.targetUserName}
                          amount={totalAmount}
                        />
                      </TableTd>
                      <TableTd>
                        <TableTypography>
                          <LiquidationDeleteIcon liquidation={liquidation} />
                        </TableTypography>
                      </TableTd>
                    </tr>

                    {/* スマホ表示 */}
                    <tr key={index} className="table-row md:hidden break-all">
                      <TableTd>
                        <TableTypography>
                          {toDateString(new Date(liquidation.date))}
                        </TableTypography>
                      </TableTd>
                      <TableTd>
                        <TableTypography>
                          {liquidation.registerUserName}
                        </TableTypography>
                      </TableTd>
                      <TableTd rowSpan={2}>
                        <div className="flex justify-end">
                          <TableTypography>
                            <LiquidationDeleteIcon liquidation={liquidation} />
                          </TableTypography>
                        </div>
                      </TableTd>
                    </tr>
                    <tr key={index} className="table-row md:hidden break-all">
                      <TableTd colSpan={2}>
                        <LiquidationFlow
                          registerUserName={liquidation.registerUserName}
                          targetUserName={liquidation.targetUserName}
                          amount={totalAmount}
                        />
                      </TableTd>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </Card>
      ) : (
        <div className="text-center">データは存在しません。</div>
      )}
    </>
  );
};
