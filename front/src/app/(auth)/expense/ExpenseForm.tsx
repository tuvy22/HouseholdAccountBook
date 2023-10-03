"use client";

import { Expense } from "@/app/util/types";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Select, Option, Input } from "@material-tailwind/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Schema, schema } from "./schema";
import { today } from "../../util/util";

export function ExpenseForm({ fetchData }: { fetchData: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: today(),
      category: "",
      amount: undefined,
      memo: "",
    },
  });

  // 現在表示されているメモのインデックスを追跡するための状態
  const [visibleMemoIndex, setVisibleMemoIndex] = useState<number | null>(null);

  const onSubmit = async (data: Schema) => {
    const userDate = data.date; // YYYY-MM-DD 形式
    const systemTime = new Date().toTimeString().split(" ")[0]; // HH:MM:SS 形式

    // ユーザーが選択した日付とシステムの現在時間を組み合わせる
    const combinedDateTime = `${userDate}T${systemTime}`;

    const newExpense: Expense = {
      category: data.category,
      amount: data.amount,
      memo: data.memo,
      date: data.date,
      sortAt: new Date().toISOString(),
    };

    const response = await fetch(`/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newExpense),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(`支出の登録に失敗しました: ${errorData.error}`);
      return;
    }

    // 支出が成功した後で、データベースから全ての支出を再取得
    fetchData();

    reset({
      date: today(),
      category: "",
      amount: undefined,
      memo: "",
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col flex-wrap justify-between gap-3 md:flex-row">
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
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="filled"
          color="green"
          size="lg"
          className="mt-4 w-full md:w-auto"
        >
          登録
        </Button>
      </div>
    </form>
  );
}
