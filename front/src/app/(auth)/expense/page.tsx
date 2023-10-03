"use client";

import React, { useEffect, useState } from "react";
import { ExpenseTable } from "@/app/(auth)/expense/ExpenseTable";
import { Expense } from "@/app/util/types";
import { ExpenseForm } from "./ExpenseForm";

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

  return (
    <main>
      <div className="container mx-auto p-10 max-w-screen-2xl">
        <ExpenseForm fetchData={fetchData} />
        {expenses.length > 0 ? (
          <div className="mt-6">
            <ExpenseTable tableRow={expenses} />
          </div>
        ) : (
          <p className="text-gray-500 mt-6 text-center">データがありません。</p>
        )}
      </div>
    </main>
  );
};

export default Expenses;
