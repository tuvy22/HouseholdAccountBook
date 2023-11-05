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
    <>
      <Typography variant="h6" color="blue-gray" className="-mb-3">
        ニックネーム
      </Typography>
      <Input
        type="text"
        size="lg"
        crossOrigin={undefined}
        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
        labelProps={{
          className: "before:content-none after:content-none",
        }}
        {...(createRegister && { ...createRegister("name") })}
        {...(updateRegister && { ...updateRegister("name") })}
      />
      {errors.name && <div className="text-red-500">{errors.name.message}</div>}
    </>
  );
}
