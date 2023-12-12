"use client";

import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Input, Typography } from "@/app/materialTailwindExports";
import { UserCreateSchema, UserUpdateSchema } from "./UserSchema";

export default function NameForm({
  errors,
  createRegister = undefined,
  updateRegister = undefined,
}: {
  errors: FieldErrors<UserCreateSchema> | FieldErrors<UserUpdateSchema>;
  createRegister?: UseFormRegister<UserCreateSchema>;
  updateRegister?: UseFormRegister<UserUpdateSchema>;
}) {
  return (
    <div className="w-full">
      <Input
        label="ニックネーム"
        type="text"
        variant="outlined"
        size="lg"
        crossOrigin={undefined}
        {...(createRegister && { ...createRegister("name") })}
        {...(updateRegister && { ...updateRegister("name") })}
      />
      {errors.name && <div className="text-red-500">{errors.name.message}</div>}
    </div>
  );
}
