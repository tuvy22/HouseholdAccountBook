"use client";

import { ExpenseForm } from "./ExpenseForm";
import { IncomeForm } from "./IncomeForm";
import { IncomeAndExpenseTabs } from "./IncomeAndExpenseTabs";
import { Schema } from "./schema";

import { useRouter } from "next/navigation";

import { getToday } from "@/app/util/util";
import { useUser } from "@/app/context/UserProvider";
import { Spinner } from "@material-tailwind/react";
import { useState } from "react";
import { postIncomeAndExpense } from "@/app/util/api";
import { IncomeAndExpense } from "@/app/util/types";

export const IncomeAndExpenseForm = () => {
  const [today] = useState(getToday());

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const user = useUser().user;

  const onSubmit = async (data: Schema, isMinus: boolean) => {
    setIsLoading(true);
    const newIncomeAndExpense: IncomeAndExpense = {
      id: 0,
      category: data.category,
      amount: isMinus ? -parseInt(data.amount) : parseInt(data.amount),
      memo: data.memo,
      date: data.date,
      sortAt: "",
      registerUserId: user.id == null ? "" : user.id,
    };
    if (!(await postIncomeAndExpense(newIncomeAndExpense))) {
      router.push("/login");
      return;
    }

    //リフレッシュ
    router.refresh();

    setIsLoading(false);
  };
  return (
    <>
      <IncomeAndExpenseTabs isIncome={true} isExpense={true}>
        <IncomeForm onSubmit={onSubmit} />
        <ExpenseForm onSubmit={onSubmit} />
      </IncomeAndExpenseTabs>
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-80 flex items-center justify-center z-50">
          <Spinner />
        </div>
      )}
    </>
  );
};
