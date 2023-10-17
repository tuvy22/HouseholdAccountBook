"use client";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Schema, schema } from "./schema";
import { getToday } from "../../util/util";
import SubmitButtonForm from "./SubmitButtonForm";
import FormInputs from "./FormInputs";

export const IncomeForm = ({
  onSubmit,
}: {
  onSubmit: (data: Schema, isMinus: boolean) => Promise<void>;
}) => {
  const [today] = useState(getToday());

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const resetForm = useCallback(() => {
    reset({
      date: today,
      category: "",
      amount: "",
      memo: "",
    });
  }, [reset, today]);
  useEffect(() => {
    resetForm();
  }, [resetForm]);

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
