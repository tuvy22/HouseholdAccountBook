"use client";

import { Expense } from "@/app/types/types";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Select, Option, Input } from "@material-tailwind/react";

interface FormProps {
  fetchData: () => void;
}

export function ExpenseForm({ fetchData }: FormProps) {
  interface IFormInput {
    date: string;
    category: string;
    amount: string;
    memo: string;
  }

  const [error, setError] = useState<string | null>(null);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInput>();

  // 現在表示されているメモのインデックスを追跡するための状態
  const [visibleMemoIndex, setVisibleMemoIndex] = useState<number | null>(null);

  // 今日の日付を YYYY-MM-DD 形式で取得
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const [defaultDate, setDefaultDate] = useState(formattedDate);

  const onSubmit = async (data: IFormInput) => {
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
      date: defaultDate,
      category: "",
      amount: "",
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
            defaultValue={defaultDate}
            size="lg"
            crossOrigin={undefined}
            {...register("date", { required: true })}
          />
          {errors.date && (
            <div className="text-red-500">日付は必須項目です。</div>
          )}
        </div>

        <div className="flex flex-col flex-grow">
          <Controller
            name="category"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select label="区分 (必須)" size="lg" {...field}>
                <Option value="">選択してください</Option>
                <Option value="a">a</Option>
                <Option value="b">b</Option>
                <Option value="c">c</Option>
              </Select>
            )}
          />
          {errors.category && (
            <div className="text-red-500">区分は必須項目です。</div>
          )}
        </div>
        <div className="flex flex-col  flex-grow">
          <Input
            label="金額 (必須)"
            type="number"
            size="lg"
            crossOrigin={undefined}
            {...register("amount", { required: true, min: 1 })}
          />
          {errors?.amount?.type === "required" && (
            <div className="text-red-500">金額は必須項目です。</div>
          )}
          {errors?.amount?.type === "min" && (
            <div className="text-red-500">
              金額は0より大きい数値を入力してください。
            </div>
          )}
        </div>
        <div className="flex flex-col grow-[2]">
          <Input
            label="メモ"
            type="text"
            size="lg"
            crossOrigin={undefined}
            {...register("memo", { maxLength: 50 })}
          />
          {errors.memo?.type === "maxLength" && (
            <div className="text-red-500">
              メモは50文字以下で入力してください。
            </div>
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
