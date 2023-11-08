import React from "react";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import AmountForm from "./AmountForm";
import CategoryForm from "./CategoryForm";
import DateForm from "./DateForm";
import MemoForm from "./MemoForm";
import { IncomeAndExpenseSchema } from "./IncomeAndExpenseSchema";
import { EXPENSE_CATEGORY, INCOME_CATEGORY } from "@/app/util/constants";

export default function FormInputs({
  errors,
  register,
  control,

  isMinus,
}: {
  errors: FieldErrors<IncomeAndExpenseSchema>;
  register: UseFormRegister<IncomeAndExpenseSchema>;
  control: Control<IncomeAndExpenseSchema>;

  isMinus: boolean;
}) {
  return (
    <div className="flex flex-col flex-wrap justify-between gap-3 md:flex-row">
      <DateForm errors={errors} register={register} />
      <CategoryForm
        errors={errors}
        register={register}
        control={control}
        options={isMinus ? EXPENSE_CATEGORY : INCOME_CATEGORY}
      />
      <AmountForm errors={errors} register={register} />
      <MemoForm errors={errors} register={register} />
    </div>
  );
}
