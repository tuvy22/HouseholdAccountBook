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
import SubmitButtonForm from "../../components/SubmitButtonForm";
import { toDateString } from "@/app/util/util";
import { EXPENSE_CATEGORY } from "@/app/util/constants";
import DateForm from "./DateForm";
import CategoryForm from "./CategoryForm";
import AmountForm from "./AmountForm";
import MemoForm from "./MemoForm";
import { BillingUserFormType } from "./BillingUserFormType";
import { BillingUserForm } from "./BillingUserForm";

export const ExpenseForm = ({
  onSubmit,
  triggerReset,
  billingUsers,
  setBillingUsers,
}: {
  onSubmit: (data: IncomeExpenseSchema, isMinus: boolean) => Promise<void>;
  triggerReset: number;
  billingUsers: BillingUserFormType[];
  setBillingUsers: Dispatch<SetStateAction<BillingUserFormType[]>>;
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
          <BillingUserForm
            watch={watch}
            billingUsers={billingUsers}
            setBillingUsers={setBillingUsers}
          />
          <DateForm errors={errors} register={register} />
          <CategoryForm
            errors={errors}
            register={register}
            control={control}
            options={EXPENSE_CATEGORY}
          />
          <AmountForm errors={errors} register={register} />
          <MemoForm errors={errors} register={register} />
        </div>
        <div className="flex justify-end">
          <SubmitButtonForm buttonName={"登録"} />
        </div>
      </form>
    </>
  );
};
