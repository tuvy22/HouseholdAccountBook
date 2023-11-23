import {
  getIncomeAndExpenseMonthlyLiquidations,
  getIncomeAndExpenseMonthlyTotal,
} from "@/app/util/apiServer";

import { Metadata } from "next";
import Liquidation from "../liquidation/Liquidation";
import { LiquidationTable } from "./LiquidationTable";
import { useParams } from "next/navigation";
export const metadata: Metadata = {
  title: "清算対象選択",
};

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const liquidations = await getIncomeAndExpenseMonthlyLiquidations(
    searchParams["from-date"],
    searchParams["to-date"],
    searchParams["target-user"]
  );
  return (
    <>
      <LiquidationTable
        liquidations={liquidations}
        targetUserId={searchParams["target-user"]}
      />
    </>
  );
}
