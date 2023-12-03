import {
  IncomeAndExpense,
  UserCreate,
  InviteUrl,
  User,
  IncomeAndExpenseMonthlyCategory,
  LiquidationCreate,
  Category,
} from "@/app/util/types";
import axios, { AxiosError } from "axios";
import {
  DELETE_NG_MESSAGE,
  GET_NG_MESSAGE,
  POST_NG_MESSAGE,
  PUT_NG_MESSAGE,
  apiHandleError,
} from "./apiHandleError";

export const auth = async (userId: string, password: string) => {
  try {
    const response = await axios.post(`/api/public/auth`, {
      userId,
      password,
    });
    const result: User = response.data;
    return result;
  } catch (error) {
    throw new Error(apiHandleError(error));
  }
};

export const getIncomeAndExpenseMonthlyCategory = async (
  yearMonth: string,
  isMinus: boolean
) => {
  try {
    const response = await axios.get(
      "/api/private/income-and-expense/monthly-category",
      {
        params: {
          yearMonth: yearMonth,
          isMinus: isMinus.toString(),
        },
      }
    );
    const result: IncomeAndExpenseMonthlyCategory[] = response.data;
    return result;
  } catch (error) {
    throw new Error(GET_NG_MESSAGE);
  }
};

export const getLoginUser = async () => {
  try {
    const response = await axios.get("/api/private/user");

    const result: User = response.data;

    return result;
  } catch (error) {
    throw new Error(GET_NG_MESSAGE);
  }
};

export const getGroupAllUser = async () => {
  try {
    const response = await axios.get("/api/private/user/group-all");

    const result: User[] = response.data;

    return result;
  } catch (error) {
    throw new Error(GET_NG_MESSAGE);
  }
};

export const postIncomeAndExpense = async (data: IncomeAndExpense) => {
  try {
    const response = await axios.post("/api/private/income-and-expense", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    throw new Error(POST_NG_MESSAGE);
  }
};

export const putIncomeAndExpense = async (
  incomeAndExpense: IncomeAndExpense
) => {
  try {
    const response = await axios.put(
      `/api/private/income-and-expense/${incomeAndExpense.id}`,
      incomeAndExpense,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    throw new Error(PUT_NG_MESSAGE);
  }
};

export const deleteIncomeAndExpense = async (id: number) => {
  try {
    await axios.delete(`/api/private/income-and-expense/${id}`);
  } catch (error) {
    throw new Error(DELETE_NG_MESSAGE);
  }
};

export const postUser = async (user: UserCreate) => {
  try {
    const response = await axios.post("/api/public/user", user, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result: User = response.data;
    return result;
  } catch (error) {
    throw new Error(POST_NG_MESSAGE);
  }
};
export const updateUser = async (user: User) => {
  try {
    const response = await axios.put(`/api/private/user/${user.id}`, user, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result: User = response.data;
    return result;
  } catch (error) {
    throw new Error(PUT_NG_MESSAGE);
  }
};

export const getUserInviteUrl = async () => {
  try {
    const response = await axios.get("/api/private/user-invite-url");

    const inviteUrl: InviteUrl = response.data;

    return inviteUrl.url;
  } catch (error) {
    throw new Error(GET_NG_MESSAGE);
  }
};
export const putInviteToken = async (token: string) => {
  try {
    const response = await axios.post(
      "/api/public/invite-cookie",
      { token: token },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    throw new Error(POST_NG_MESSAGE);
  }
};
export const deleteInviteToken = async () => {
  try {
    await axios.delete("/api/public/invite-cookie");
  } catch (error) {
    throw new Error(DELETE_NG_MESSAGE);
  }
};

export const postLiquidation = async (data: LiquidationCreate) => {
  try {
    const response = await axios.post("/api/private/liquidation", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    throw new Error(POST_NG_MESSAGE);
  }
};

export const deleteLiquidation = async (id: number) => {
  try {
    await axios.delete(`/api/private/liquidation/${id}`);
  } catch (error) {
    throw new Error(DELETE_NG_MESSAGE);
  }
};
export const getCategoryAllClient = async (isExpense: boolean) => {
  const expenseURL = "/api/private/category/all/expense";
  const incomeURL = "/api/private/category/all/income";

  const url = isExpense ? expenseURL : incomeURL;

  try {
    const response = await axios.get(url);

    const result: Category[] = response.data;

    return result;
  } catch (error) {
    throw new Error(GET_NG_MESSAGE);
  }
};

export const replaceAllCategorys = async (
  datas: Category[],
  isExpense: boolean
) => {
  try {
    await axios.post(
      `/api/private/replace-all-category/${isExpense ? "expense" : "income"}`,
      datas,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    throw new Error(POST_NG_MESSAGE);
  }
};
