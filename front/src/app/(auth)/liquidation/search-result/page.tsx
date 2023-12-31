import { getIncomeAndExpenseLiquidations } from "@/app/util/apiServer";

import { Metadata } from "next";
import { LiquidationSearchResult } from "./LiquidationSearchResult";
import { IncomeAndExpense } from "@/app/util/types";
export const metadata: Metadata = {
  title: "清算検索結果一覧",
};

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const liquidations: IncomeAndExpense[] =
    await getIncomeAndExpenseLiquidations(
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
