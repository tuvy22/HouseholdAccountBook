"use client";

import { ExpenseForm } from "./ExpenseForm";
import { IncomeForm } from "./IncomeForm";
import { IncomeAndExpenseTabs } from "./IncomeAndExpenseTabs";
import { IncomeExpenseSchema } from "./IncomeAndExpenseSchema";

import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserProvider";
import { useState } from "react";
import { postIncomeAndExpense } from "@/app/util/apiClient";
import {
  IncomeAndExpenseBillingUser,
  IncomeAndExpense,
} from "@/app/util/types";
import { addError, useAlert } from "@/app/context/AlertProvider";
import { Spinner } from "@/app/materialTailwindExports";
import { toDateObject } from "@/app/util/util";
import {
  BillingUserFormType,
  convertToBillingUsers,
} from "./BillingUserFormType";

export const IncomeAndExpenseForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const loginUser = useUser().user;
  const [billingUsers, setBillingUsers] = useState<BillingUserFormType[]>([]);
  const [triggerReset, setTriggerReset] = useState(0);
  const alert = useAlert();

  const onSubmit = async (data: IncomeExpenseSchema, isMinus: boolean) => {
    setIsLoading(true);
    setTriggerReset((prev) => prev + 1);

    const newIncomeAndExpense: IncomeAndExpense = {
      id: 0,
      category: data.category,
      amount: isMinus ? -parseInt(data.amount) : parseInt(data.amount),
      memo: data.memo,
      date: toDateObject(data.date),
      registerUserID: loginUser.id == null ? "" : loginUser.id,
      billingUsers: convertToBillingUsers(billingUsers, isMinus),
      registerUserName: "",
    };

    try {
      await postIncomeAndExpense(newIncomeAndExpense);
    } catch (error) {
      if (error instanceof Error) {
        addError(error.message, alert);
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
        <ExpenseForm
          onSubmit={onSubmit}
          triggerReset={triggerReset}
          billingUsers={billingUsers}
          setBillingUsers={setBillingUsers}
        />
      </IncomeAndExpenseTabs>
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-80 flex items-center justify-center z-50">
          <Spinner />
        </div>
      )}
    </>
  );
};
