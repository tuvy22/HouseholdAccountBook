import {
  getIncomeAndExpenseLiquidations,
  getIncomeAndExpenseMonthlyTotal,
} from "@/app/util/apiServer";

import { Metadata } from "next";
import LiquidationSearch from "../search/LiquidationSearch";
import { LiquidationSearchResult } from "./LiquidationSearchResult";
import { useParams } from "next/navigation";
export const metadata: Metadata = {
  title: "清算対象選択",
};

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const liquidations = await getIncomeAndExpenseLiquidations(
    searchParams["from-date"],
    searchParams["to-date"],
    searchParams["target-user"]
  );
  return (
    <>
      <LiquidationSearchResult
        liquidations={liquidations}
        targetUserId={searchParams["target-user"]}
      />
    </>
  );
}
