"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
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
  expense: Expense;
  updateExpense: (updatedExpense: Expense) => void;
};

export const UpdateExpenseDialog: React.FC<Props> = ({
  open,
  handleOpen,
  expense,
  updateExpense,
}) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    // defaultValues: {
    //   date: expense.date,
    //   category: expense.category,
    //   amount: expense.amount.toString(),
    //   memo: expense.memo,
    // },
  });
  useEffect(() => {
    if (open) {
      reset({
        date: expense.date,
        category: expense.category,
        amount: expense.amount.toString(),
        memo: expense.memo,
      });
    }
  }, [
    open,
    expense.amount,
    expense.category,
    expense.date,
    expense.memo,
    reset,
  ]);

  const onSubmit = (data: Schema) => {
    console.log("onsubmit実行");

    const userDate = data.date; // YYYY-MM-DD 形式
    const systemTime = new Date().toTimeString().split(" ")[0]; // HH:MM:SS 形式

    // ユーザーが選択した日付とシステムの現在時間を組み合わせる
    const combinedDateTime = `${userDate}T${systemTime}`;

    const newExpense: Expense = {
      id: expense.id,
      category: data.category,
      amount: parseInt(data.amount),
      memo: data.memo,
      date: data.date,
      sortAt: new Date().toISOString(),
      registerUserId: expense.registerUserId,
    };
    updateExpense(newExpense);
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
