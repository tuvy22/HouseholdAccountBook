import { IncomeAndExpense } from "@/app/util/types";
import { Schema } from "./schema";

  export const registerSchema = async (data: Schema,userId:string,isMinus:boolean) => {
    const newIncomeAndExpense: IncomeAndExpense = {
      id: 0,
      category: data.category,
      amount: isMinus ? -parseInt(data.amount) : parseInt(data.amount),
      memo: data.memo,
      date: data.date,
      sortAt: "",
      registerUserId: userId
    };

    const response = await fetch(`/api/private/incomeAndExpense`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newIncomeAndExpense),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(`支出の登録に失敗しました: ${errorData.error}`);
      return false;
    }

      return true;
  };