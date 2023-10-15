"use client";

import { useCallback, useEffect, useState } from "react";
import { ExpenseForm } from "./ExpenseForm";
import { IncomeForm } from "./IncomeForm";
import { ListTabs } from "./ListTabs";
import { Schema, schema } from "./schema";
import { registerSchema } from "./register";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { getToday } from "@/app/util/util";
import { useUser } from "@/app/context/UserProvider";

export const ListForm = () => {
  // const [today] = useState(getToday());

  // const [isLoading, setIsLoading] = useState(false);

  // const {
  //   control,
  //   register,
  //   handleSubmit,
  //   reset,
  //   formState: { errors },
  // } = useForm<Schema>({
  //   resolver: zodResolver(schema),
  // });
  // const router = useRouter();
  // const user = useUser().user;

  // const onSubmit = async (data: Schema) => {
  //   setIsLoading(true);
  //   if (!(await registerSchema(data, user.id == null ? "" : user.id, true))) {
  //     router.push("/login");
  //     return;
  //   }

  //   resetForm();

  //   //リフレッシュ
  //   router.refresh();

  //   setIsLoading(false);
  // };
  // const resetForm = useCallback(() => {
  //   reset({
  //     date: today,
  //     category: "",
  //     amount: "",
  //     memo: "",
  //   });
  // }, [reset, today]);
  // useEffect(() => {
  //   resetForm();
  // }, [resetForm]);
  return (
    <ListTabs isIncome={true} isExpense={true}>
      <IncomeForm />
      <ExpenseForm />
    </ListTabs>
  );
};
