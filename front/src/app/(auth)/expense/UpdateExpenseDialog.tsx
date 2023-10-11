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
        amount: updatedExpense.amount.toString(),
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
  ]);

  const onSubmit = (data: Schema) => {
    const newExpense: Expense = {
      id: updatedExpense.id,
      category: data.category,
      amount: parseInt(data.amount),
      memo: data.memo,
      date: data.date,
      sortAt: updatedExpense.sortAt,
      registerUserId: updatedExpense.registerUserId,
    };
    handleUpdate(newExpense);
    handleOpen();
  };

  return (
    <>
      <Dialog open={open} handler={handleOpen}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>更新内容入力</DialogHeader>
          <DialogBody className="flex flex-col flex-wrap justify-between gap-3 md:flex-row">
            <div className="flex flex-col flex-grow">
              <Input
                label="日付 (必須)"
                type="date"
                size="lg"
                crossOrigin={undefined}
                {...register("date")}
              />
              {errors.date && (
                <div className="text-red-500">{errors.date.message}</div>
              )}
            </div>
            <div className="flex flex-col flex-grow">
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select label="区分 (必須)" size="lg" {...field}>
                    <Option value="a">a</Option>
                    <Option value="b">b</Option>
                    <Option value="c">c</Option>
                  </Select>
                )}
              />
              {errors.category && (
                <div className="text-red-500">{errors.category.message}</div>
              )}
            </div>
            <div className="flex flex-col  flex-grow">
              <Input
                label="金額 (必須)"
                type="number"
                size="lg"
                crossOrigin={undefined}
                {...register("amount")}
              />
              {errors.amount && (
                <div className="text-red-500">{errors.amount.message}</div>
              )}
            </div>
            <div className="flex flex-col grow-[2]">
              <Input
                label="メモ"
                type="text"
                size="lg"
                crossOrigin={undefined}
                {...register("memo")}
              />
              {errors.memo && (
                <div className="text-red-500">{errors.memo.message}</div>
              )}
            </div>
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
