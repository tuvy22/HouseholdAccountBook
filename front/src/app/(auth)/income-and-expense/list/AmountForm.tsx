"use client";

import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Schema } from "./schema";
import { Input } from "@/app/materialTailwindExports";

export default function AmountForm({
  errors,
  register,
}: {
  errors: FieldErrors<Schema>;
  register: UseFormRegister<Schema>;
}) {
  return (
    <div className="flex flex-col flex-grow">
      <Input
        label="金額 (必須)"
        type="number"
        size="lg"
        crossOrigin={undefined}
        {...register("amount")}
      />
      {errors.amount && (
        <div className="text-red-500">{errors.amount.message}</div>
      )}
    </div>
  );
}
