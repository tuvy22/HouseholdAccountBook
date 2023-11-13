"use client";

import { ExpenseForm } from "./ExpenseForm";
import { IncomeForm } from "./IncomeForm";
import { IncomeAndExpenseTabs } from "./IncomeAndExpenseTabs";
import { IncomeAndExpenseSchema } from "./IncomeAndExpenseSchema";

import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserProvider";
import { useState } from "react";
import { postIncomeAndExpense } from "@/app/util/apiClient";
import { IncomeAndExpense } from "@/app/util/types";
import { useAlert } from "@/app/context/AlertProvider";
import { Spinner } from "@/app/materialTailwindExports";
import { toDateObject } from "@/app/util/util";

export const IncomeAndExpenseForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const user = useUser().user;
  const [triggerReset, setTriggerReset] = useState(0);
  const alert = useAlert();

  const onSubmit = async (data: IncomeAndExpenseSchema, isMinus: boolean) => {
    setIsLoading(true);
    setTriggerReset((prev) => prev + 1);

    const newIncomeAndExpense: IncomeAndExpense = {
      id: 0,
      category: data.category,
      amount: isMinus ? -parseInt(data.amount) : parseInt(data.amount),
      memo: data.memo,
      date: toDateObject(data.date),
      registerUserId: user.id == null ? "" : user.id,
      IsInitial: false,
    };

    try {
      await postIncomeAndExpense(newIncomeAndExpense);
    } catch (error) {
      if (error instanceof Error) {
        let message = error.message;
        alert.setAlertValues((prev) => [
          ...prev,
          { color: "red", value: message },
        ]);
      }
    }
    //リフレッシュ
    router.refresh();

    setIsLoading(false);
  };
  return (
    <>
      <IncomeAndExpenseTabs isIncome={true} isExpense={true}>
        <IncomeForm onSubmit={onSubmit} triggerReset={triggerReset} />
        <ExpenseForm onSubmit={onSubmit} triggerReset={triggerReset} />
      </IncomeAndExpenseTabs>
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-80 flex items-center justify-center z-50">
          <Spinner />
        </div>
      )}
    </>
  );
};
