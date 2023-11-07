"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IncomeAndExpenseSchema,
  incomeAndExpenseSchema,
} from "./IncomeAndExpenseSchema";
import SubmitButtonForm from "./SubmitButtonForm";
import FormInputs from "./FormInputs";
import { toDateString } from "@/app/util/util";

export const ExpenseForm = ({
  onSubmit,
  triggerReset,
}: {
  onSubmit: (data: IncomeAndExpenseSchema, isMinus: boolean) => Promise<void>;
  triggerReset: number;
}) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<IncomeAndExpenseSchema>({
    resolver: zodResolver(incomeAndExpenseSchema),
  });

  const resetForm = useCallback(() => {
    const categoryValue = getValues().category;
    reset({
      date: toDateString(new Date()),
      category: categoryValue && categoryValue.length > 0 ? categoryValue : "",
      amount: "",
      memo: "",
    });
  }, [getValues, reset]);
  useEffect(() => {
    resetForm();
  }, [resetForm, triggerReset]);

  return (
    <>
      <form onSubmit={(e) => handleSubmit((data) => onSubmit(data, true))(e)}>
        <FormInputs
          errors={errors}
          register={register}
          control={control}
          isMinus={true}
        />
        <div className="flex justify-end">
          <SubmitButtonForm />
        </div>
      </form>
    </>
  );
};
