import axios from "axios";

import { cookies } from "next/headers";
import { SESSION_ID_COOKIE } from "./constants";
import {
  Category,
  IncomeAndExpense,
  IncomeAndExpenseMonthlyTotal,
  Liquidation,
  User,
} from "./types";
import { apiHandleError } from "./apiHandleError";

export const getIncomeAndExpense = async (page: string) => {
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get(SESSION_ID_COOKIE);

    if (cookie?.name.length || 0 > 0) {
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
    }
    return undefined;
  } catch (error) {
    throw new Error(apiHandleError(error));
  }
};
export const getIncomeAndExpenseMaxPage = async () => {
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get(SESSION_ID_COOKIE);

    if (cookie?.name.length || 0 > 0) {
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
    }
    return 0;
  } catch (error) {
    throw new Error(apiHandleError(error));
  }
};

export const getIncomeAndExpenseMonthlyTotal = async () => {
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get(SESSION_ID_COOKIE);

    if (cookie?.name.length || 0 > 0) {
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
    }
    return undefined;
  } catch (error) {
    throw new Error(apiHandleError(error));
  }
};
export const getGroupAllUser = async () => {
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get(SESSION_ID_COOKIE);

    if (process.env.BUILD != "build") {
      console.log(cookie);
      const response = await axios.get(
        `http://localhost:8080/api/localhost/user/group-all`,
        {
          headers: {
            cache: "no-store",
            Cookie: `${cookie?.name}=${cookie?.value};`,
          },
        }
      );
      const result: User[] = response.data;
      return result;
    }
    return undefined;
  } catch (error) {
    throw error;
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

    if (cookie?.name.length || 0 > 0) {
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
    }
    return undefined;
  } catch (error) {
    throw new Error(apiHandleError(error));
  }
};

export const getLiquidations = async () => {
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get(SESSION_ID_COOKIE);

    if (cookie?.name.length || 0 > 0) {
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
    }
    return undefined;
  } catch (error) {
    throw new Error(apiHandleError(error));
  }
};
