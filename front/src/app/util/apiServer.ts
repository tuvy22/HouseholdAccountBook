import axios from "axios";
import { GET_NG_MESSAGE } from "./apiHandleError";
import { cookies } from "next/headers";
import { SESSION_ID_COOKIE } from "./constants";
import {
  Category,
  IncomeAndExpense,
  IncomeAndExpenseMonthlyTotal,
  Liquidation,
  User,
} from "./types";

export const getIncomeAndExpense = async (page: string) => {
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get(SESSION_ID_COOKIE);

    const response = await axios.get(
      "http://localhost:8080/api/localhost/income-and-expense/all",
      {
        headers: {
          cache: "no-store",
          Cookie: `${cookie?.name}=${cookie?.value};`,
        },
        params: {
          page: page,
        },
      }
    );
    const result: IncomeAndExpense[] = response.data;
    return result;
  } catch (error) {
    throw new Error(GET_NG_MESSAGE);
  }
};
export const getIncomeAndExpenseMaxPage = async () => {
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get(SESSION_ID_COOKIE);

    const response = await axios.get(
      "http://localhost:8080/api/localhost/income-and-expense/all/max-page",
      {
        headers: {
          cache: "no-store",
          Cookie: `${cookie?.name}=${cookie?.value};`,
        },
      }
    );
    const maxPage: number = response.data;
    return maxPage;
  } catch (error) {
    throw new Error(GET_NG_MESSAGE);
  }
};

export const getIncomeAndExpenseMonthlyTotal = async () => {
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get(SESSION_ID_COOKIE);
    const response = await axios.get(
      "http://localhost:8080/api/localhost/income-and-expense/monthly-total",
      {
        headers: {
          cache: "no-store",
          Cookie: `${cookie?.name}=${cookie?.value};`,
        },
      }
    );

    const result: IncomeAndExpenseMonthlyTotal[] = response.data;
    return result;
  } catch (error) {
    throw new Error(GET_NG_MESSAGE);
  }
};
export const getGroupAllUser = async () => {
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get(SESSION_ID_COOKIE);

    const response = await axios.get(
      "http://localhost:8080/api/localhost/user/group-all",
      {
        headers: {
          cache: "no-store",
          Cookie: `${cookie?.name}=${cookie?.value};`,
        },
      }
    );
    const result: User[] = response.data;
    return result;
  } catch (error) {
    throw new Error(GET_NG_MESSAGE);
  }
};
export const getIncomeAndExpenseLiquidations = async (
  fromDate: string,
  toDate: string,
  targetUserId: string
) => {
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get(SESSION_ID_COOKIE);

    const response = await axios.get(
      "http://localhost:8080/api/localhost/income-and-expense/liquidations",
      {
        headers: {
          cache: "no-store",
          Cookie: `${cookie?.name}=${cookie?.value};`,
        },
        params: {
          fromDate: fromDate,
          toDate: toDate,
          targetUserId: targetUserId,
        },
      }
    );
    const result: IncomeAndExpense[] = response.data;
    return result;
  } catch (error) {
    throw new Error(GET_NG_MESSAGE);
  }
};

export const getLiquidations = async () => {
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get(SESSION_ID_COOKIE);

    const response = await axios.get(
      "http://localhost:8080/api/localhost/liquidation/all",
      {
        headers: {
          cache: "no-store",
          Cookie: `${cookie?.name}=${cookie?.value};`,
        },
      }
    );
    const result: Liquidation[] = response.data;
    return result;
  } catch (error) {
    throw new Error(GET_NG_MESSAGE);
  }
};
export const getCategoryAllServer = async (expense: boolean) => {
  const expenseURL = "http://localhost:8080/api/localhost/category/all/expense";
  const incomeURL = "http://localhost:8080/api/localhost/category/all/income";

  const url = expense ? expenseURL : incomeURL;

  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get(SESSION_ID_COOKIE);

    const response = await axios.get(url, {
      headers: {
        cache: "no-store",
        Cookie: `${cookie?.name}=${cookie?.value};`,
      },
    });
    const result: Category[] = response.data;
    return result;
  } catch (error) {
    throw new Error(GET_NG_MESSAGE);
  }
};
