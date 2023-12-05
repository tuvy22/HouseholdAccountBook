"use client";

import { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { IncomeExpenseSchema } from "./IncomeAndExpenseSchema";
import { Controller } from "react-hook-form";
import { Select, Option } from "@/app/materialTailwindExports";
import { Category } from "@/app/util/types";

export default function CategoryForm({
  errors,
  register,
  control,
  options,
}: {
  errors: FieldErrors<IncomeExpenseSchema>;
  register: UseFormRegister<IncomeExpenseSchema>;
  control: Control<IncomeExpenseSchema>;
  options: Category[];
}) {
  return (
    <>
      {options.length > 0 && (
        <div className="flex flex-col flex-grow">
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select label="区分 (必須)" size="lg" {...field}>
                {options.map((option) => (
                  <Option key={option.id} value={option.name}>
                    {option.name}
                  </Option>
                ))}
              </Select>
            )}
          />
          {errors.category && (
            <div className="text-red-500">{errors.category.message}</div>
          )}
        </div>
      )}
    </>
  );
}
