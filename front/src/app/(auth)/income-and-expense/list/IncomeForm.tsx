"use client";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Schema, schema } from "./schema";
import SubmitButtonForm from "./SubmitButtonForm";
import FormInputs from "./FormInputs";
import { toDateString } from "@/app/util/util";

export const IncomeForm = ({
  onSubmit,
  triggerReset,
}: {
  onSubmit: (data: Schema, isMinus: boolean) => Promise<void>;
  triggerReset: number;
}) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const resetForm = useCallback(() => {
    const categoryValue = getValues().category;
    reset({
      date: toDateString(new Date()),
      category: categoryValue && categoryValue.length > 0 ? categoryValue : "",
      amount: "",
      memo: "",
    });
  }, [getValues, reset]);
  useEffect(() => {
    resetForm();
  }, [resetForm, triggerReset]);

  return (
    <>
      <form onSubmit={(e) => handleSubmit((data) => onSubmit(data, false))(e)}>
        <FormInputs
          errors={errors}
          register={register}
          control={control}
          isMinus={false}
        />
        <div className="flex justify-end">
          <SubmitButtonForm />
        </div>
      </form>
    </>
  );
};
