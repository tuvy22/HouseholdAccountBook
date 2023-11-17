"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogBody,
} from "@/app/materialTailwindExports";
import { IncomeAndExpense } from "../../util/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IncomeExpenseSchema,
  incomeExpenseSchema,
} from "./IncomeAndExpenseSchema";
import { isMinus, toDateObject, toDateString } from "@/app/util/util";
import { IncomeAndExpenseTabs } from "./IncomeAndExpenseTabs";
import { useForm } from "react-hook-form";
import DateForm from "./DateForm";
import CategoryForm from "./CategoryForm";
import { EXPENSE_CATEGORY, INCOME_CATEGORY } from "@/app/util/constants";
import AmountForm from "./AmountForm";
import MemoForm from "./MemoForm";

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
  } = useForm<IncomeExpenseSchema>({
    resolver: zodResolver(incomeExpenseSchema),
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

  const onSubmit = (data: IncomeExpenseSchema) => {
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
              <div className="flex flex-col flex-wrap justify-between gap-3 md:flex-row">
                <DateForm errors={errors} register={register} />
                <CategoryForm
                  errors={errors}
                  register={register}
                  control={control}
                  options={isDaialogMinus ? EXPENSE_CATEGORY : INCOME_CATEGORY}
                />
                <AmountForm errors={errors} register={register} />
                <MemoForm errors={errors} register={register} />
              </div>
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
