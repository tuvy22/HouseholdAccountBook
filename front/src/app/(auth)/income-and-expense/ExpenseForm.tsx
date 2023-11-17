"use client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IncomeExpenseSchema,
  incomeExpenseSchema,
} from "./IncomeAndExpenseSchema";
import SubmitButtonForm from "./SubmitButtonForm";
import { toDateString } from "@/app/util/util";
import { EXPENSE_CATEGORY } from "@/app/util/constants";
import DateForm from "./DateForm";
import CategoryForm from "./CategoryForm";
import AmountForm from "./AmountForm";
import MemoForm from "./MemoForm";
import { BillingUserCheckboxForm } from "./BillingUserCheckboxForm";
import { BillingUser } from "./BillingUserType";

export const ExpenseForm = ({
  onSubmit,
  triggerReset,
  billingUsers,
  setBillingUsers,
}: {
  onSubmit: (data: IncomeExpenseSchema, isMinus: boolean) => Promise<void>;
  triggerReset: number;
  billingUsers: BillingUser[];
  setBillingUsers: Dispatch<SetStateAction<BillingUser[]>>;
}) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    getValues,
    watch,
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
      <form onSubmit={(e) => handleSubmit((data) => onSubmit(data, true))(e)}>
        <div className="flex flex-col flex-wrap justify-between gap-3 md:flex-row">
          <DateForm errors={errors} register={register} />
          <CategoryForm
            errors={errors}
            register={register}
            control={control}
            options={EXPENSE_CATEGORY}
          />
          <AmountForm errors={errors} register={register} />
          <MemoForm errors={errors} register={register} />
          <BillingUserCheckboxForm
            watch={watch}
            billingUsers={billingUsers}
            setBillingUsers={setBillingUsers}
          />
        </div>
        <div className="flex justify-end">
          <SubmitButtonForm />
        </div>
      </form>
    </>
  );
};
