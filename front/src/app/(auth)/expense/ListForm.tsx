"use client";

import { ExpenseForm } from "./ExpenseForm";
import { IncomeForm } from "./IncomeForm";
import { ListTabs } from "./ListTabs";
import { Schema } from "./schema";
import { registerSchema } from "./register";

import { useRouter } from "next/navigation";

import { getToday } from "@/app/util/util";
import { useUser } from "@/app/context/UserProvider";
import { Spinner } from "@material-tailwind/react";
import { useState } from "react";

export const ListForm = () => {
  const [today] = useState(getToday());

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const user = useUser().user;

  const onSubmit = async (data: Schema, isMinus: boolean) => {
    setIsLoading(true);
    if (
      !(await registerSchema(data, user.id == null ? "" : user.id, isMinus))
    ) {
      router.push("/login");
      return;
    }

    //リフレッシュ
    router.refresh();

    setIsLoading(false);
  };
  return (
    <>
      <ListTabs isIncome={true} isExpense={true}>
        <IncomeForm onSubmit={onSubmit} />
        <ExpenseForm onSubmit={onSubmit} />
      </ListTabs>
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-80 flex items-center justify-center z-50">
          <Spinner />
        </div>
      )}
    </>
  );
};
