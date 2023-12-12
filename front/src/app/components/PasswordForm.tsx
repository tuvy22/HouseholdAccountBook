"use client";

import { FieldError, FieldErrors, UseFormRegister } from "react-hook-form";
import { Input } from "@/app/materialTailwindExports";
import { PasswordChangeSchema, UserCreateSchema } from "./UserSchema";
import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function PasswordForm({
  label,
  createRegister = undefined,
  passwordChangeRegister = undefined,
  createRegisterName = "password",
  passwordChangeRegisterName = "password",
  fieldError,
}: {
  label: string;
  createRegister?: UseFormRegister<UserCreateSchema>;
  createRegisterName?: "password" | "passwordConfirmation";
  passwordChangeRegister?: UseFormRegister<PasswordChangeSchema>;
  passwordChangeRegisterName?:
    | "prePassword"
    | "password"
    | "passwordConfirmation";
  fieldError: FieldError | undefined;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);
  return (
    <div className="relative w-full">
      <Input
        label={label}
        type={showPassword ? "text" : "password"}
        variant="outlined"
        size="lg"
        crossOrigin={undefined}
        className="pr-10"
        {...(passwordChangeRegister && {
          ...passwordChangeRegister(passwordChangeRegisterName),
        })}
        {...(createRegister && {
          ...createRegister(createRegisterName),
        })}
      />
      <div className="absolute top-2 right-2 text-gray-500 cursor-pointer hover:text-green-500">
        {showPassword ? (
          <VisibilityIcon onClick={toggleShowPassword} />
        ) : (
          <VisibilityOffIcon onClick={toggleShowPassword} />
        )}
      </div>
      {fieldError && <div className="text-red-500">{fieldError.message}</div>}
    </div>
  );
}
