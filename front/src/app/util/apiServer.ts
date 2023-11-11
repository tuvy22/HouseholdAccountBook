import axios from "axios";
import { GET_NG_MESSAGE } from "./apiHandleError";
import { cookies } from "next/headers";
import { LOGIN_COOKIE_TOKEN } from "./constants";
import { IncomeAndExpense } from "./types";

export const getIncomeAndExpense = async () => {
  const cookieStore = cookies();
  const cookie = cookieStore.get(LOGIN_COOKIE_TOKEN);
  try {
    const response = await axios.get(
      "http://localhost:8080/api/localhost/income-and-expense/all",
      {
        headers: {
          cache: "no-store",
          Cookie: `${cookie?.name}=${cookie?.value};`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(GET_NG_MESSAGE);
  }
};
export const getIncomeAndExpenseMonthlyTotal = async () => {
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get(LOGIN_COOKIE_TOKEN);
    const response = await axios.get(
      "http://localhost:8080/api/localhost/income-and-expense/monthly-total",
      {
        headers: {
          cache: "no-store",
          Cookie: `${cookie?.name}=${cookie?.value};`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(GET_NG_MESSAGE);
  }
};
