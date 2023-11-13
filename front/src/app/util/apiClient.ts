import {
  IncomeAndExpense,
  UserCreate,
  InviteUrl,
  User,
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
    return response.data;
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

    return response.data;
  } catch (error) {
    throw new Error(GET_NG_MESSAGE);
  }
};

export const postIncomeAndExpense = async (
  incomeAndExpense: IncomeAndExpense
) => {
  try {
    const response = await axios.post(
      "/api/private/income-and-expense",
      incomeAndExpense,
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
    return response.data;
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
    return response.data;
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