"use client";

import { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { Schema } from "./schema";
import { Controller } from "react-hook-form";
import { Select, Option } from "@material-tailwind/react";

export default function CategoryForm({
  errors,
  register,
  control,
  options,
}: {
  errors: FieldErrors<Schema>;
  register: UseFormRegister<Schema>;
  control: Control<Schema>;
  options: string[];
}) {
  return (
    <div className="flex flex-col flex-grow">
      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <Select label="区分 (必須)" size="lg" {...field}>
            {options.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        )}
      />
      {errors.category && (
        <div className="text-red-500">{errors.category.message}</div>
      )}
    </div>
  );
}
