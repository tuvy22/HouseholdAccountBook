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
