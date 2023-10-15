"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Spinner } from "@material-tailwind/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Schema, schema } from "./schema";
import { useRouter } from "next/navigation";
import { expenseCategory, getToday } from "../../util/util";
import { useUser } from "@/app/context/UserProvider";
import DateForm from "./DateForm";
import CategoryForm from "./CategoryForm";
import AmountForm from "./AmountForm";
import MemoForm from "./MemoForm";
import SubmitButtonForm from "./SubmitButtonForm";
import { registerSchema } from "./register";
import FormInputs from "./FormInputs";

export const ExpenseForm = () => {
  const [today] = useState(getToday());

  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });
  const router = useRouter();
  const user = useUser().user;

  const onSubmit = async (data: Schema) => {
    setIsLoading(true);
    if (!(await registerSchema(data, user.id == null ? "" : user.id, true))) {
      router.push("/login");
      return;
    }

    resetForm();

    //リフレッシュ
    router.refresh();

    setIsLoading(false);
  };
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInputs
          errors={errors}
          register={register}
          control={control}
          hasPlusAmount={false}
        />
        <div className="flex justify-end">
          <SubmitButtonForm />
        </div>
      </form>
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-80 flex items-center justify-center z-50">
          <Spinner />
        </div>
      )}
    </>
  );
};
