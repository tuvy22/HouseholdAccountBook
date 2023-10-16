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
import { Expense } from "../../util/types";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Schema, schema } from "./schema";
import DateForm from "./DateForm";
import AmountForm from "./AmountForm";
import CategoryForm from "./CategoryForm";
import MemoForm from "./MemoForm";
import { expenseCategory, incomeCategory } from "@/app/util/util";
import FormInputs from "./FormInputs";
import { ListTabs } from "./ListTabs";

type Props = {
  open: boolean;
  handleOpen: () => void;
  updatedExpense: Expense;
  handleUpdate: (expense: Expense) => void;
};

export const UpdateExpenseDialog: React.FC<Props> = ({
  open,
  handleOpen,
  updatedExpense,
  handleUpdate,
}) => {
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
        date: updatedExpense.date,
        category: updatedExpense.category,
        amount: updatedExpense.hasPlusAmount
          ? updatedExpense.amount.toString()
          : (-updatedExpense.amount).toString(),
        memo: updatedExpense.memo,
      });
    }
  }, [
    open,
    updatedExpense.amount,
    updatedExpense.category,
    updatedExpense.date,
    updatedExpense.memo,
    reset,
    updatedExpense.hasPlusAmount,
  ]);

  const onSubmit = (data: Schema) => {
    const newExpense: Expense = {
      id: updatedExpense.id,
      category: data.category,
      amount: updatedExpense.hasPlusAmount
        ? parseInt(data.amount)
        : -parseInt(data.amount),
      memo: data.memo,
      date: data.date,
      sortAt: updatedExpense.sortAt,
      registerUserId: updatedExpense.registerUserId,
      hasPlusAmount: updatedExpense.hasPlusAmount,
    };
    handleUpdate(newExpense);
    handleOpen();
  };

  return (
    <>
      <Dialog open={open} handler={handleOpen}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>編集</DialogHeader>
          <DialogBody>
            <ListTabs
              isIncome={updatedExpense.hasPlusAmount}
              isExpense={!updatedExpense.hasPlusAmount}
            >
              <FormInputs
                errors={errors}
                register={register}
                control={control}
                hasPlusAmount={updatedExpense.hasPlusAmount}
              />
            </ListTabs>
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
