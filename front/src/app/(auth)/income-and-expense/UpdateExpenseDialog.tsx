"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  Input,
  Option,
  DialogFooter,
  DialogHeader,
  DialogBody,
  Select,
} from "@material-tailwind/react";
import { IncomeAndExpense } from "../../util/types";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Schema, schema } from "./schema";
import DateForm from "./DateForm";
import AmountForm from "./AmountForm";
import CategoryForm from "./CategoryForm";
import MemoForm from "./MemoForm";
import { expenseCategory, incomeCategory, isMinus } from "@/app/util/util";
import FormInputs from "./FormInputs";
import { IncomeAndExpenseTabs } from "./IncomeAndExpenseTabs";

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
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });
  useEffect(() => {
    if (open) {
      reset({
        date: updatedIncomeAndExpense.date,
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

  const onSubmit = (data: Schema) => {
    const newIncomeAndExpense: IncomeAndExpense = {
      id: updatedIncomeAndExpense.id,
      category: data.category,
      amount: isDaialogMinus ? -parseInt(data.amount) : parseInt(data.amount),
      memo: data.memo,
      date: data.date,
      sortAt: updatedIncomeAndExpense.sortAt,
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
