"use client";

import { Button, Input, Typography } from "@/app/materialTailwindExports";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  getInitialAmount,
  putInitialAmount,
  updateUser,
} from "@/app/util/apiClient";
import { useUser } from "@/app/context/UserProvider";
import { addError, addSuccess, useAlert } from "@/app/context/AlertProvider";
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
    reset,
    formState: { errors },
  } = useForm<InitialAmountSchema>({
    resolver: zodResolver(initialAmountSchema),
    defaultValues: {
      amount: "",
    },
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const fetchAmount = await getInitialAmount();
        const resetAmount: InitialAmountSchema = {
          amount: fetchAmount.toString(),
        };

        reset(resetAmount);
      } catch (error) {
        if (error instanceof Error) {
          addError(error.message, alert);
        }
      }
    };
    fetch();
  }, [alert, reset]);

  const onSubmit = async (data: InitialAmountSchema) => {
    try {
      const updateAmount = await putInitialAmount(parseInt(data.amount, 10));
      const resetAmount: InitialAmountSchema = {
        amount: updateAmount.toString(),
      };

      reset(resetAmount);

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
      className="w-full max-w-sm mx-auto"
      onSubmit={(e) => handleSubmit((data) => onSubmit(data))(e)}
    >
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
      <SubmitButtonForm buttonName={"更新"} buttonColor={"green"} />
    </form>
  );
}
