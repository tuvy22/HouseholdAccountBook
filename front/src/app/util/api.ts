import { IncomeAndExpense } from "@/app/util/types";
import axios from "axios";

const HTTP_OK = 200;

export const postIncomeAndExpense = async (incomeAndExpense: IncomeAndExpense) => {
  try {
    const response = await axios.post("/api/private/incomeAndExpense", incomeAndExpense, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.status === HTTP_OK;
  } catch (error) {
    return false;
  }
};

export const getIncomeAndExpense = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/localhost/incomeAndExpenseAll", {
      headers: {
        cache: "no-store",
      },
    });

    return response.data;
  } catch (error) {

    return [];
  }
};

export const putIncomeAndExpense = async (incomeAndExpense: IncomeAndExpense) => {
  try {
    const response = await axios.put(`/api/private/incomeAndExpense/${incomeAndExpense.id}`, incomeAndExpense, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.status === HTTP_OK;
  } catch (error) {

    return false;
  }
};

export const deleteIncomeAndExpense = async (id: number) => {
  try {
    await axios.delete(`/api/private/incomeAndExpense/${id}`);
  } catch (error) {

  }
};
