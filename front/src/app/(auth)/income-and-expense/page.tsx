import { Metadata } from "next";
import { IncomeAndExpenseForm } from "./IncomeAndExpenseForm";
import { IncomeAndExpenseTableAll } from "./IncomeAndExpenseTableAll";
import { Suspense } from "react";
import { Spinner } from "@/app/materialTailwindExports";
export const metadata: Metadata = {
  title: "家計簿一覧",
};

export default function page({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  return (
    <>
      <IncomeAndExpenseForm />
      <Suspense fallback={<Spinner className="m-auto" />}>
        <IncomeAndExpenseTableAll page={searchParams["page"]} />
      </Suspense>
    </>
  );
}
