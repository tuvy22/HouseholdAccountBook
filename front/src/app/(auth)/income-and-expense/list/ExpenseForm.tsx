"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Schema, schema } from "./schema";
import { getToday } from "../../../util/util";
import SubmitButtonForm from "./SubmitButtonForm";
import FormInputs from "./FormInputs";

export const ExpenseForm = ({
  onSubmit,
  triggerReset,
}: {
  onSubmit: (data: Schema, isMinus: boolean) => Promise<void>;
  triggerReset: number;
}) => {
  const [today] = useState(getToday());

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
    reset({
      date: today,
      category: getValues().category,
      amount: "",
      memo: "",
    });
  }, [getValues, reset, today]);
  useEffect(() => {
    resetForm();
  }, [resetForm, triggerReset]);

  return (
    <>
      <form onSubmit={(e) => handleSubmit((data) => onSubmit(data, true))(e)}>
        <FormInputs
          errors={errors}
          register={register}
          control={control}
          isMinus={true}
        />
        <div className="flex justify-end">
          <SubmitButtonForm />
        </div>
      </form>
    </>
  );
};
