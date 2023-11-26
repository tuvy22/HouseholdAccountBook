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

const TABLE_INFO = [
  { header: "清算日", addClassName: "" },
  { header: "登録", addClassName: "" },
  { header: "清算内容", addClassName: "" },
  { header: "", addClassName: "w-28" },
];

export const LiquidationResultList = async () => {
  const fetchData = await getLiquidations();

  return (
    <>
      <div className="flex justify-between">
        <div>
          <Typography className="text-xl text-center md:text-left">
            清算結果一覧
          </Typography>
        </div>
        <div className="flex items-end">
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
                  <tr key={index} className="break-all">
                    <td className="p-2 md:p-4 border-b border-blue-gray-50">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {toDateString(new Date(liquidation.date))}
                      </Typography>
                    </td>
                    <td className="p-2 md:p-4 border-b border-blue-gray-50">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {liquidation.registerUserName}
                      </Typography>
                    </td>
                    <td className="p-2 md:p-4 border-b border-blue-gray-50">
                      <LiquidationFlow
                        registerUserName={liquidation.registerUserName}
                        targetUserName={liquidation.targetUserName}
                        amount={totalAmount}
                      />
                    </td>
                    <td className="p-2 md:p-4 border-b border-blue-gray-50 text-center">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        <LiquidationDeleteIcon liquidation={liquidation} />
                      </Typography>
                    </td>
                  </tr>
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
