import { IncomeAndExpense, User } from "@/app/util/types";
import axios from "axios";

const HTTP_OK = 200;
const HTTP_STATUS_UNAUTHORIZED = 401;
const GET_NG_MESSAGE = "データの取得に失敗しました。";
const POST_NG_MESSAGE = "データの送信に失敗しました。";
const PUT_NG_MESSAGE = "データの更新に失敗しました。";
const DELETE_NG_MESSAGE = "データの削除に失敗しました。";
const INVALID_CREDENTIALS = "IDまたはパスワードが間違っています。";

export const auth = async (userId: string, password: string) => {
  try {
    const response = await axios.post(`/api/public/auth`, {
      userId,
      password,
    });
    return response.data;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.status === HTTP_STATUS_UNAUTHORIZED
    ) {
      throw new Error(INVALID_CREDENTIALS);
    } else {
      throw new Error(POST_NG_MESSAGE);
    }
  }
};

export const getIncomeAndExpense = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/api/localhost/incomeAndExpenseAll",
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
      "http://localhost:8080/api/localhost/incomeAndExpense/monthlyTotal",
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
      "/api/private/incomeAndExpense/monthlyCategory",
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
      "/api/private/incomeAndExpense",
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
      `/api/private/incomeAndExpense/${incomeAndExpense.id}`,
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
    await axios.delete(`/api/private/incomeAndExpense/${id}`);
  } catch (error) {}
};

export const postUser = async (user: User) => {
  try {
    const response = await axios.post("/api/public/user", user, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    throw new Error(DELETE_NG_MESSAGE);
  }
};
