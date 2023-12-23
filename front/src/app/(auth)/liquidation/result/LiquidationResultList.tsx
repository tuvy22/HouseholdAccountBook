import { Liquidation } from "@/app/util/types";
import { Button, Card, Typography } from "@/app/materialTailwindExports";
import { toDateString } from "@/app/util/util";
import { getLiquidations } from "@/app/util/apiServer";
import LiquidationFlow from "../LiquidationFlow";
import LiquidationDeleteIcon from "@/app/components/LiquidationDeleteIcon";
import TableThTypography from "@/app/components/table/TableThTypography";
import TableTd from "@/app/components/table/TableTd";
import TableTypography from "@/app/components/table/TableTypography";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const LiquidationResultList = async () => {
  const fetchData = await getLiquidations();

  return (
    <>
      <div className="flex md:justify-between justify-center flex-col md:flex-row">
        <div>
          <Typography
            variant="h3"
            color="gray"
            className="text-center md:text-left"
          >
            清算結果一覧
          </Typography>
        </div>
        <div className="mt-6 md:mt-0">
          <Link href={"/liquidation/search"}>
            <Button
              variant="text"
              color="red"
              size="lg"
              className=" w-full md:w-28 row-span-3"
            >
              {"戻る"}
            </Button>
          </Link>
        </div>
      </div>

      {fetchData && fetchData.length > 0 ? (
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
                  <React.Fragment key={index}>
                    {/* デスクトップ表示 */}
                    <tr className="hidden md:table-row break-all">
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
                        <div className="flex justify-end">
                          <TableTypography>
                            <LiquidationDeleteIcon liquidation={liquidation} />
                          </TableTypography>
                        </div>
                      </TableTd>
                    </tr>

                    {/* スマホ表示 */}
                    <tr className="table-row md:hidden break-all">
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
                    <tr className="table-row md:hidden break-all">
                      <TableTd colSpan={2}>
                        <LiquidationFlow
                          registerUserName={liquidation.registerUserName}
                          targetUserName={liquidation.targetUserName}
                          amount={totalAmount}
                        />
                      </TableTd>
                    </tr>
                  </React.Fragment>
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
