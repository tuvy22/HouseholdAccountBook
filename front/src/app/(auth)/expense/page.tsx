"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@material-tailwind/react";
import { PopoverAnimation } from "@/components/Popover";
import { useForm } from "react-hook-form";

interface Expense {
  date: string;
  category: string;
  amount: string;
  memo: string;
  sortAt: string;
}
interface IFormInput {
  date: string;
  category: string;
  amount: string;
  memo: string;
}

function convertToUserFriendlyMessage(error: unknown): string {
  // エラーが文字列型である場合
  if (typeof error === "string") {
    if (error === "404") {
      return "ページが見つかりません。";
    }
    if (error.startsWith("NetworkError")) {
      return "ネットワークエラーが発生しました。";
    }
  }

  // エラーがErrorオブジェクトである場合
  if (error instanceof Error) {
    if (error.message === "Failed to fetch") {
      return "データの取得に失敗しました。";
    }
  }

  // それ以外の未知のエラー
  return "予期しないエラーが発生しました。";
}

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const {
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

  // データを取得する関数
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/expenses`);
      if (response.ok) {
        const data = await response.json();
        console.log(data);

        setExpenses(data);
      } else {
        const errorData = await response.json();
        setError(
          `Failed to fetch: ${errorData.message || response.statusText}`
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {convertToUserFriendlyMessage(error)}</div>;

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
    <main>
      <div className="container mx-auto p-10 max-w-screen-2xl">
        <h1 className="text-2xl font-bold mb-4">家計簿一覧</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col flex-wrap justify-between gap-3 md:flex-row">
            <div className="flex flex-col flex-grow">
              <label className="mb-1">
                日付<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                //ref={dateRef}
                className="border rounded py-1 px-2"
                defaultValue={defaultDate}
                {...register("date", { required: true })}
              />
              {errors.date && (
                <div className="text-red-500">日付は必須項目です。</div>
              )}
            </div>

            <div className="flex flex-col flex-grow">
              <label className="mb-1">
                区分<span className="text-red-500">*</span>
              </label>
              <select
                className="border rounded py-1 px-2"
                {...register("category", { required: true })}
              >
                <option value="">選択してください</option>
                <option value="a">a</option>
                <option value="b">b</option>
                <option value="c">c</option>
              </select>
              {errors.category && (
                <div className="text-red-500">区分は必須項目です。</div>
              )}
            </div>
            <div className="flex flex-col  flex-grow">
              <label className="mb-1">
                金額<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                className="border rounded py-1 px-2"
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
              <label className="mb-1">メモ</label>
              <input
                type="text"
                className="border rounded py-1 px-2"
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
              size="md"
              className="mt-4 w-full md:w-auto"
            >
              登録
            </Button>
          </div>
        </form>
        {expenses.length > 0 ? (
          <div className="shadow overflow-hidden border-b border-gray-200 md:rounded-lg mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    日付
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    支払い
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    区分
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    金額
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    メモ
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {expenses.map((expense, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                  >
                    <td className="px-6 py-4">{expense.date}</td>
                    <td className="px-6 py-4">XXXXXX</td>
                    <td className="px-6 py-4">{expense.category}</td>
                    <td className="px-6 py-4">{expense.amount}</td>
                    <td className="px-6 py-4">
                      <div className="hidden md:block">
                        {" "}
                        {/* デスクトップサイズでの  表示 */}
                        {expense.memo}
                      </div>
                      <div className="md:hidden">
                        {" "}
                        {/* スマホサイズでの表示 */}
                        {expense.memo.length >= 10 ? (
                          <PopoverAnimation
                            content={expense.memo}
                            buttonText="表示"
                          />
                        ) : (
                          expense.memo
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 mt-6 text-center">データがありません。</p>
        )}
      </div>
    </main>
  );
};

export default Expenses;
