"use client";

import { Button, Input, Typography } from "@/app/materialTailwindExports";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { updateUser } from "@/app/util/apiClient";
import { useUser } from "@/app/context/UserProvider";
import { useAlert } from "@/app/context/AlertProvider";
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
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }

    //結果アラート
    const newAlertValue: AlertValue = {
      color: "green",
      value: "更新が成功しました。",
    };
    alert.setAlertValues([...alert.alertValues, newAlertValue]);
  };
  return (
    <form
      className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
      onSubmit={(e) => handleSubmit((data) => onSubmit(data))(e)}
    >
      <div className="mb-1 flex flex-col gap-6">
        <Typography variant="h6" color="blue-gray" className="-mb-3">
          初期残高
        </Typography>
        <Input
          type="number"
          size="lg"
          crossOrigin={undefined}
          className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
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
