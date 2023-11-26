"use client";

import { FieldErrors, UseFormRegister } from "react-hook-form";
import { IncomeExpenseSchema } from "./IncomeAndExpenseSchema";
import { Input } from "@/app/materialTailwindExports";
import { LiquidationSchema } from "../liquidation/search/LiquidationSchema";

function DateForm({
  errors,
  register,
}: {
  errors: FieldErrors<IncomeExpenseSchema>;
  register: UseFormRegister<IncomeExpenseSchema>;
}) {
  return (
    <div className="flex flex-col flex-grow">
      <Input
        label="日付 (必須)"
        type="date"
        size="lg"
        crossOrigin={undefined}
        {...register("date")}
      />
      {errors.date && <div className="text-red-500">{errors.date.message}</div>}
    </div>
  );
}
export default DateForm;
