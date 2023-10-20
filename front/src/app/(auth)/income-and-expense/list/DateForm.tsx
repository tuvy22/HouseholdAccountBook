"use client";

import { Input } from "@material-tailwind/react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Schema } from "./schema";

export default function DateForm({
  errors,
  register,
}: {
  errors: FieldErrors<Schema>;
  register: UseFormRegister<Schema>;
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
