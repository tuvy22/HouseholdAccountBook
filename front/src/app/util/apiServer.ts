import axios from "axios";

import { cookies } from "next/headers";
import { SESSION_ID_COOKIE } from "./constants";
import { apiHandleError } from "./apiHandleError";

export const getIncomeAndExpense = async (page: string) => {
  if (!page) {
    return undefined;
  }

  try {
    const cookieStore = cookies();
    const sessionId = cookieStore.get(SESSION_ID_COOKIE);

    const response = await fetch(
      `http://${process.env.APP_HOST}:8080/api/localhost/income-and-expense/all?page=${page}`,
      {
        headers: {
          Cookie: `${sessionId?.name}=${sessionId?.value};`,
        },
        cache: "no-store",
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};

export const getIncomeAndExpenseMaxPage = async () => {
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get(SESSION_ID_COOKIE);

    const response = await fetch(
      `http://${process.env.APP_HOST}:8080/api/localhost/income-and-expense/all/max-page`,
      {
        headers: {
          Cookie: `${cookie?.name}=${cookie?.value};`,
        },
        cache: "no-store",
      }
    );
    const maxPage = response.json();
    return maxPage;
  } catch (error) {
    throw new Error(apiHandleError(error));
  }
};

export const getIncomeAndExpenseMonthlyTotal = async () => {
  try {
    const cookieStore = cookies();
    const sessionId = cookieStore.get(SESSION_ID_COOKIE);

    const cookie = `${sessionId?.name}=${sessionId?.value}`;

    const options: RequestInit = {
      headers: {
        cookie,
      },
      cache: "no-store",
    };

    const response = await fetch(
      `http://${process.env.APP_HOST}:8080/api/localhost/income-and-expense/monthly-total`,
      options
    );

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error(apiHandleError(error));
  }
};

export const getGroupAllUser = async () => {
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get(SESSION_ID_COOKIE);
    const response = await fetch(
      `http://${process.env.APP_HOST}:8080/api/localhost/user/group-all`,
      {
        headers: {
          Cookie: `${cookie?.name}=${cookie?.value};`,
        },
        cache: "no-store",
      }
    );
    const result = response.json();
    return result;
  } catch (error) {
    throw new Error(apiHandleError(error));
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

    const response = await fetch(
      `http://${process.env.APP_HOST}:8080/api/localhost/income-and-expense/liquidations?fromDate=${fromDate}&toDate=${toDate}&targetUserId=${targetUserId}`,
      {
        headers: {
          Cookie: `${cookie?.name}=${cookie?.value};`,
        },
        cache: "no-store",
      }
    );

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error(apiHandleError(error));
  }
};

export const getLiquidations = async () => {
  try {
    const cookieStore = cookies();
    const sessionId = cookieStore.get(SESSION_ID_COOKIE);

    const cookie = `${sessionId?.name}=${sessionId?.value}`;

    const options: RequestInit = {
      headers: {
        cookie,
      },
      cache: "no-store",
    };

    const response = await fetch(
      `http://${process.env.APP_HOST}:8080/api/localhost/liquidation/all`,
      options
    );
    const result = response.json();
    return result;
  } catch (error) {
    throw new Error(apiHandleError(error));
  }
};
