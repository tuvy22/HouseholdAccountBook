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
import { useAlert } from "@/app/context/AlertProvider";
import { Spinner } from "@/app/materialTailwindExports";
import { toDateObject } from "@/app/util/util";
import { BillingUserFormType } from "./BillingUserFormType";

export const IncomeAndExpenseForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const user = useUser().user;
  const [billingUsers, setBillingUsers] = useState<BillingUserFormType[]>([]);
  const [triggerReset, setTriggerReset] = useState(0);
  const alert = useAlert();

  const onSubmit = async (data: IncomeExpenseSchema, isMinus: boolean) => {
    setIsLoading(true);
    setTriggerReset((prev) => prev + 1);

    let postBillingUsers: IncomeAndExpenseBillingUser[] = [];

    billingUsers.map((user: BillingUserFormType) => {
      if (user.checked) {
        const newBillingUser: IncomeAndExpenseBillingUser = {
          incomeAndExpenseID: 0,
          userID: user.id,
          amount: isMinus
            ? -parseInt(user.amount, 10) || 0
            : parseInt(user.amount, 10) || 0,
          liquidationFg: false,
          userName: "",
        };
        postBillingUsers = [...postBillingUsers, newBillingUser];
      }
    });

    const newIncomeAndExpense: IncomeAndExpense = {
      id: 0,
      category: data.category,
      amount: isMinus ? -parseInt(data.amount) : parseInt(data.amount),
      memo: data.memo,
      date: toDateObject(data.date),
      registerUserId: user.id == null ? "" : user.id,
      billingUsers: postBillingUsers,
      registerUserName: "",
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
