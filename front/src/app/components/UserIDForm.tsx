"use client";

import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Input, Typography } from "@/app/materialTailwindExports";
import { UserCreateSchema, UserUpdateSchema } from "./UserSchema";

export default function UserIDForm({
  errors,
  register,
}: {
  errors: FieldErrors<UserCreateSchema>;
  register: UseFormRegister<UserCreateSchema>;
}) {
  return (
    <div className="w-full">
      <Input
        label="ユーザID"
        type="text"
        variant="outlined"
        size="lg"
        crossOrigin={undefined}
        {...register("id")}
      />
      {errors.id && <div className="text-red-500">{errors.id.message}</div>}
    </div>
  );
}
