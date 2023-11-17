"use client";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import SubmitButtonForm from "./SubmitButtonForm";
import { toDateString } from "@/app/util/util";
import {
  IncomeExpenseSchema,
  incomeExpenseSchema,
} from "./IncomeAndExpenseSchema";
import DateForm from "./DateForm";
import CategoryForm from "./CategoryForm";
import AmountForm from "./AmountForm";
import MemoForm from "./MemoForm";
import { INCOME_CATEGORY } from "@/app/util/constants";

export const IncomeForm = ({
  onSubmit,
  triggerReset,
}: {
  onSubmit: (data: IncomeExpenseSchema, isMinus: boolean) => Promise<void>;
  triggerReset: number;
}) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    getValues,
    formState: { errors },
  } = useForm<IncomeExpenseSchema>({
    resolver: zodResolver(incomeExpenseSchema),
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
      <form onSubmit={(e) => handleSubmit((data) => onSubmit(data, false))(e)}>
        <div className="flex flex-col flex-wrap justify-between gap-3 md:flex-row">
          <DateForm errors={errors} register={register} />
          <CategoryForm
            errors={errors}
            register={register}
            control={control}
            options={INCOME_CATEGORY}
          />
          <AmountForm errors={errors} register={register} />
          <MemoForm errors={errors} register={register} />
        </div>
        <div className="flex justify-end">
          <SubmitButtonForm />
        </div>
      </form>
    </>
  );
};
