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
  date:string;
  sortAt: string;
}



function convertToUserFriendlyMessage(error: unknown): string {
  // エラーが文字列型である場合
  if (typeof error === 'string') {
    if (error === '404') {
      return 'ページが見つかりません。';
    }
    if (error.startsWith('NetworkError')) {
      return 'ネットワークエラーが発生しました。';
    }
  }
  
  // エラーがErrorオブジェクトである場合
  if (error instanceof Error) {
    if (error.message === 'Failed to fetch') {
      return 'データの取得に失敗しました。';
    }
  }
  
  // それ以外の未知のエラー
  return '予期しないエラーが発生しました。';
}



const Expenses = () => {

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(false); 
  const [error, setError] = useState<string | null>(null); 

  const categoryRef = useRef<HTMLSelectElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const memoRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  // 今日の日付を YYYY-MM-DD 形式で取得
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  const [defaultDate, setDefaultDate] = useState(formattedDate);
  
// データを取得する関数
const fetchData = async () => {
  setLoading(true);
  try {
    const response = await fetch('http://localhost:8080/expenses');
    if (response.ok) {
      const data = await response.json();
      console.log(data)
      const sortedExpenses = data.sort((a: Expense, b: Expense) => {
        const dateComparison = b.date.localeCompare(a.date);
        if (dateComparison !== 0) {
          return dateComparison;
        }
        return b.sortAt.localeCompare(a.sortAt);
      });
      setExpenses(sortedExpenses);
    } else {
      const errorData = await response.json();
      setError(`Failed to fetch: ${errorData.message || response.statusText}`);
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

  
  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryRef.current || !amountRef.current || !memoRef.current || !dateRef.current) {
      return;
    }

    if (
      categoryRef.current.value &&
      amountRef.current.value &&
      dateRef.current.value
    ) {
      // 数値チェック
      const amount = parseInt(amountRef.current.value, 10);
      if (isNaN(amount) || amount <= 0) {
        alert("金額は0より大きい数値を入力してください。");
        return;
      }

      // 文字列長チェック
      const memo = memoRef.current.value;
      if (memo.length > 255) {
        alert("メモは255文字以下で入力してください。");
        return;
      }
    } else {
      // ここにエラー処理を書く
      alert('全ての必須項目に値を入力してください。');
      return;
    }
    const userDate = dateRef.current.value; // YYYY-MM-DD 形式
    const systemTime = new Date().toTimeString().split(" ")[0]; // HH:MM:SS 形式

    // ユーザーが選択した日付とシステムの現在時間を組み合わせる
    const combinedDateTime = `${userDate}T${systemTime}`;

    
    const newExpense: Expense = {
      category: categoryRef.current.value,
      amount: amountRef.current.value,
      memo: memoRef.current.value,
      date: dateRef.current.value,
      sortAt: new Date().toISOString(),
    };
    
    const response = await fetch('http://localhost:8080/expenses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
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

    // フォームのリセット
    alert('支出を登録しました。');
    if (amountRef.current && memoRef.current && dateRef.current) {
      amountRef.current.value = '';
      memoRef.current.value = '';
      dateRef.current.value = defaultDate;
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
                defaultValue={defaultDate}

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
          <div className="flex justify-end"> 
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

