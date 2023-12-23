import axios from "axios";

import { cookies } from "next/headers";
import { SESSION_ID_COOKIE } from "./constants";
import {
  IncomeAndExpense,
  IncomeAndExpenseMonthlyTotal,
  Liquidation,
  User,
} from "./types";
import { apiHandleError } from "./apiHandleError";

export const getIncomeAndExpense = async (page: string) => {
  if (process.env.BUILD == "build") {
    return undefined;
  }

  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get(SESSION_ID_COOKIE);

    const response = await axios.get(
      `http://${process.env.APP_HOST}:8080/api/localhost/income-and-expense/all`,
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
    throw new Error(apiHandleError(error));
  }
};
export const getIncomeAndExpenseMaxPage = async () => {
  if (process.env.BUILD == "build") {
    return 0;
  }

  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get(SESSION_ID_COOKIE);

    const response = await axios.get(
      `http://${process.env.APP_HOST}:8080/api/localhost/income-and-expense/all/max-page`,
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
    throw new Error(apiHandleError(error));
  }
};

export const getIncomeAndExpenseMonthlyTotal = async () => {
  if (process.env.BUILD == "build") {
    return undefined;
  }

  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get(SESSION_ID_COOKIE);
    const response = await axios.get(
      `http://${process.env.APP_HOST}:8080/api/localhost/income-and-expense/monthly-total`,
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
    throw new Error(apiHandleError(error));
  }
};
export const getGroupAllUser = async () => {
  if (process.env.BUILD == "build") {
    return undefined;
  }

  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get(SESSION_ID_COOKIE);

    console.log(cookie);
    const response = await axios.get(
      `http://${process.env.APP_HOST}/api/localhost/user/group-all`,
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
    throw error;
  }
};
export const getIncomeAndExpenseLiquidations = async (
  fromDate: string,
  toDate: string,
  targetUserId: string
) => {
  if (process.env.BUILD == "build") {
    return undefined;
  }

  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get(SESSION_ID_COOKIE);

    const response = await axios.get(
      `http://${process.env.APP_HOST}:8080/api/localhost/income-and-expense/liquidations`,
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
    throw new Error(apiHandleError(error));
  }
};

export const getLiquidations = async () => {
  if (process.env.BUILD == "build") {
    return undefined;
  }

  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get(SESSION_ID_COOKIE);
    const response = await axios.get(
      `http://${process.env.APP_HOST}:8080/api/localhost/liquidation/all`,
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
    throw new Error(apiHandleError(error));
  }
};
