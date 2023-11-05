"use client";

import { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { IncomeAndExpenseSchema } from "./IncomeAndExpenseSchema";
import { Controller } from "react-hook-form";
import { Select, Option } from "@/app/materialTailwindExports";

export default function CategoryForm({
  errors,
  register,
  control,
  options,
}: {
  errors: FieldErrors<IncomeAndExpenseSchema>;
  register: UseFormRegister<IncomeAndExpenseSchema>;
  control: Control<IncomeAndExpenseSchema>;
  options: string[];
}) {
  return (
    <div className="flex flex-col flex-grow">
      <Controller
        control={control}
        name="category"
        render={({ field }) => (
          <Select label="区分 (必須)" size="lg" {...field}>
            {options.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        )}
      />
      {errors.category && (
        <div className="text-red-500">{errors.category.message}</div>
      )}
    </div>
  );
}
