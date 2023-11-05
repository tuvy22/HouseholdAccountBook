"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogBody,
} from "@/app/materialTailwindExports";
import { IncomeAndExpense } from "../../../util/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IncomeAndExpenseSchema,
  incomeAndExpenseSchema,
} from "./IncomeAndExpenseSchema";
import { isMinus, toDateObject, toDateString } from "@/app/util/util";
import FormInputs from "./FormInputs";
import { IncomeAndExpenseTabs } from "./IncomeAndExpenseTabs";
import { useForm } from "react-hook-form";

type Props = {
  open: boolean;
  handleOpen: () => void;
  updatedIncomeAndExpense: IncomeAndExpense;
  handleUpdate: (incomeAndExpense: IncomeAndExpense) => void;
};

export const UpdateExpenseDialog: React.FC<Props> = ({
  open,
  handleOpen,
  updatedIncomeAndExpense,
  handleUpdate,
}) => {
  const isDaialogMinus = isMinus(updatedIncomeAndExpense.amount);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IncomeAndExpenseSchema>({
    resolver: zodResolver(incomeAndExpenseSchema),
  });
  useEffect(() => {
    if (open) {
      reset({
        date: toDateString(new Date(updatedIncomeAndExpense.date)),
        category: updatedIncomeAndExpense.category,
        amount: isDaialogMinus
          ? (-updatedIncomeAndExpense.amount).toString()
          : updatedIncomeAndExpense.amount.toString(),
        memo: updatedIncomeAndExpense.memo,
      });
    }
  }, [
    open,
    updatedIncomeAndExpense.amount,
    updatedIncomeAndExpense.category,
    updatedIncomeAndExpense.date,
    updatedIncomeAndExpense.memo,
    reset,
    isDaialogMinus,
  ]);

  const onSubmit = (data: IncomeAndExpenseSchema) => {
    const newIncomeAndExpense: IncomeAndExpense = {
      id: updatedIncomeAndExpense.id,
      category: data.category,
      amount: isDaialogMinus ? -parseInt(data.amount) : parseInt(data.amount),
      memo: data.memo,
      date: toDateObject(data.date),
      registerUserId: updatedIncomeAndExpense.registerUserId,
    };
    handleUpdate(newIncomeAndExpense);
    handleOpen();
  };

  return (
    <>
      <Dialog open={open} handler={handleOpen}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>編集</DialogHeader>
          <DialogBody>
            <IncomeAndExpenseTabs
              isIncome={!isDaialogMinus}
              isExpense={isDaialogMinus}
            >
              <FormInputs
                errors={errors}
                register={register}
                control={control}
                isMinus={isDaialogMinus}
              />
            </IncomeAndExpenseTabs>
          </DialogBody>

          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={() => {
                handleOpen();
              }}
              className="mr-1"
            >
              キャンセル
            </Button>
            <Button variant="gradient" color="green" type="submit">
              更新
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
};
