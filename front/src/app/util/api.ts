import {
  IncomeAndExpense,
  UserName,
  UserCreate,
  InviteUrl,
} from "@/app/util/types";
import axios, { AxiosError } from "axios";

const GET_NG_MESSAGE = "データの取得に失敗しました。";
const POST_NG_MESSAGE = "データの送信に失敗しました。";
const PUT_NG_MESSAGE = "データの更新に失敗しました。";
const DELETE_NG_MESSAGE = "データの削除に失敗しました。";

function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const code = error.response.data.code;
      switch (code) {
        case "already_in_group":
          return "すでに所属するグループに加入することはできません。";
        case "invalid_credentials":
          return "認証に失敗しました。";
        case "invalid_login":
          return "IDまたはパスワードが間違っています。";
        case "internal_server_error":
          return "サーバーでエラーが発生しました。";
        default:
          return "予期せぬエラーが発生しました。";
      }
    } else if (error.request) {
      return "サーバーに接続できませんでした。";
    } else {
      return "送信中にエラーが発生しました。";
    }
  }
  return "送信中にエラーが発生しました。";
}

export const auth = async (userId: string, password: string) => {
  try {
    const response = await axios.post(`/api/public/auth`, {
      userId,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getIncomeAndExpense = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/api/localhost/income-and-expense/all",
      {
        headers: {
          cache: "no-store",
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
    const response = await axios.get(
      "http://localhost:8080/api/localhost/income-and-expense/monthly-total",
      {
        headers: {
          cache: "no-store",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(GET_NG_MESSAGE);
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
    throw new Error(PUT_NG_MESSAGE);
  }
};

export const updateUserName = async (userNamePut: UserName) => {
  try {
    const response = await axios.put("/api/private/user/name", userNamePut, {
      headers: {
        "Content-Type": "application/json",
      },
    });
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
      "/api/public/set-invite-cookie",
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
