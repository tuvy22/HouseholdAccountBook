"use client";

import { Button, Input, Typography } from "@/app/materialTailwindExports";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { updateUser } from "@/app/util/apiClient";
import { useUser } from "@/app/context/UserProvider";
import { addSuccess, useAlert } from "@/app/context/AlertProvider";
import { AlertValue } from "@/app/components/AlertCustoms";
import {
  InitialAmountSchema,
  initialAmountSchema,
} from "./InitialAmountSchema";
import SubmitButtonForm from "@/app/components/SubmitButtonForm";

export function InitialAmount() {
  const [error, setError] = useState("");
  const alert = useAlert();
  const user = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InitialAmountSchema>({
    resolver: zodResolver(initialAmountSchema),
    defaultValues: {
      amount: user.user.initialAmount?.toString() ?? "",
    },
  });
  const onSubmit = async (data: InitialAmountSchema) => {
    user.user.initialAmount = parseInt(data.amount, 10);
    try {
      await updateUser(user.user);
      //結果アラート
      addSuccess("更新が成功しました。", alert);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };
  return (
    <form
      className="mx-auto items-center mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
      onSubmit={(e) => handleSubmit((data) => onSubmit(data))(e)}
    >
      <div className="mb-1 flex flex-col gap-6">
        <Input
          label={"初期残高"}
          type="number"
          variant="outlined"
          size="lg"
          crossOrigin={undefined}
          {...register("amount")}
        />
        {errors.amount && (
          <div className="text-red-500">{errors.amount.message}</div>
        )}
      </div>
      <SubmitButtonForm buttonName={"更新"} buttonColor={"green"} />
    </form>
  );
}
