"use client"
import type { Metadata } from 'next'
import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@material-tailwind/react";



// export const revalidate = 0;

export const metadata: Metadata = {
  title: '家計簿アプリ',
  description: '家計簿アプリです。',
}

interface  Expense {
  category: string;
  amount: string;
  memo: string;
  date:string
}

// 今日の日付を YYYY-MM-DD 形式で取得
const today = new Date();
const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [loading, setLoading] = useState<boolean>(false); 
  const [error, setError] = useState<string | null>(null); 

  
  const categoryRef = useRef<HTMLSelectElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const memoRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // APIエンドポイントを指定してデータを取得
        const response = await fetch('http://localhost:8080/expenses');
        if (response.ok) {
          const data = await response.json();
          setExpenses(data);
        } else {
          setError(`Failed to fetch: ${response.statusText}`);
        }
      } catch (error) {
        setError(`Error: ${error}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      categoryRef.current && 
      amountRef.current && 
      memoRef.current && 
      dateRef.current &&
      categoryRef.current.value &&
      amountRef.current.value &&
      dateRef.current.value
    ) {
      const newExpense: Expense = {
        category: categoryRef.current.value,
        amount: amountRef.current.value,
        memo: memoRef.current.value,
        date: dateRef.current.value,
      };
      setExpenses([...expenses, newExpense]);
      categoryRef.current.value = '';
      amountRef.current.value = '';
      memoRef.current.value = '';
      dateRef.current.value = '';
    } else {
      // ここにエラー処理を書く
      alert('全ての項目に値を入力してください。');
    }
  };

  return (
    <main>
      <div className="container mx-auto p-10">
        {/* <h1 className="text-2xl font-bold mb-4">家計簿一覧</h1> */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col flex-wrap justify-between gap-3 md:flex-row">
            <div className="flex flex-col flex-grow">
            <label className="mb-1">日付<span className="text-red-500">*</span></label>
              <input
                type="date"
                ref={dateRef}
                className="border rounded py-1 px-2"
                defaultValue={formattedDate}  // ここを修正

              />
            </div>
            <div className="flex flex-col flex-grow">
              <label className="mb-1">区分<span className="text-red-500">*</span></label>
              <select
                ref={categoryRef}
                className="border rounded py-1 px-2"
              >
                <option value="">選択してください</option>
                <option value="a">a</option>
                <option value="b">b</option>
                <option value="c">c</option>
              </select>
            </div>
            <div className="flex flex-col  flex-grow">
              <label className="mb-1">金額<span className="text-red-500">*</span></label>
              <input
                type="number"
                ref={amountRef}
                className="border rounded py-1 px-2"
              />
            </div>
            <div className="flex flex-col grow-[2]">
              <label className="mb-1">メモ</label>
              <input
                type="text"
                ref={memoRef}
                className="border rounded py-1 px-2"
              />
            </div>
          </div>
          <div className="flex justify-end"> {/* この行を追加 */}
            <Button type="submit" variant="filled" color="green" size="md" className="mt-4 w-full md:w-auto">
              登録
            </Button>
          </div>
        </form>
        {expenses.length > 0 ? (
          <div className="shadow overflow-hidden border-b border-gray-200 md:rounded-lg mt-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日付</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">区分</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金額</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">メモ</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenses.map((expense, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                    <td className="px-6 py-4 whitespace-nowrap">{expense.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{expense.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{expense.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{expense.memo}</td>
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

