"use client";

import { FieldErrors, UseFormRegister } from "react-hook-form";
import { IncomeExpenseSchema } from "./IncomeAndExpenseSchema";
import { Input } from "@/app/materialTailwindExports";

export default function DateForm({
  errors,
  register,
}: {
  errors: FieldErrors<IncomeExpenseSchema>;
  register: UseFormRegister<IncomeExpenseSchema>;
}) {
  return (
    <div className="flex flex-col grow-[2]">
      <Input
        label="メモ"
        type="text"
        size="lg"
        crossOrigin={undefined}
        {...register("memo")}
      />
      {errors.memo && <div className="text-red-500">{errors.memo.message}</div>}
    </div>
  );
}
