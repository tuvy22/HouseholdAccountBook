import { Metadata } from "next";
import { LiquidationResultList } from "./LiquidationResultList";

export const metadata: Metadata = {
  title: "清算結果一覧",
};

export default async function Page() {
  return (
    <>
      <LiquidationResultList />
    </>
  );
}
