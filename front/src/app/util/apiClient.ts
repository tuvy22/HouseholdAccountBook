import {
  UserCreate,
  InviteUrl,
  User,
  IncomeAndExpenseMonthlyCategory,
  LiquidationCreate,
  Category,
  InitialAmount,
  InviteToken,
  UserUpdate,
  PasswordChange,
  IncomeAndExpenseCreate,
  IncomeAndExpenseUpdate,
  Receipt,
} from "@/app/util/types";
import axios from "axios";
import { apiHandleError } from "./apiHandleError";

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
export const authDel = async () => {
  try {
    await axios.post(`/api/private/auth-del`);
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
    throw new Error(apiHandleError(error));
  }
};

export const getLoginUser = async () => {
  try {
    const response = await axios.get("/api/private/user");

    const result: User = response.data;

    return result;
  } catch (error) {
    throw new Error(apiHandleError(error));
  }
};

export const getGroupAllUser = async () => {
  try {
    const response = await axios.get("/api/private/user/group-all");

    const result: User[] = response.data;

    return result;
  } catch (error) {
    throw new Error(apiHandleError(error));
  }
};

export const postIncomeAndExpense = async (data: IncomeAndExpenseCreate) => {
  try {
    const response = await axios.post("/api/private/income-and-expense", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    throw new Error(apiHandleError(error));
  }
};

export const putIncomeAndExpense = async (
  id: number,
  incomeAndExpense: IncomeAndExpenseUpdate
) => {
  try {
    const response = await axios.put(
      `/api/private/income-and-expense/${id}`,
      incomeAndExpense,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    throw new Error(apiHandleError(error));
  }
};

export const deleteIncomeAndExpense = async (id: number) => {
  try {
    await axios.delete(`/api/private/income-and-expense/${id}`);
  } catch (error) {
    throw new Error(apiHandleError(error));
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
    throw new Error(apiHandleError(error));
  }
};
export const updateUser = async (user: UserUpdate) => {
  try {
    const response = await axios.put("/api/private/user", user, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result: User = response.data;
    return result;
  } catch (error) {
    throw new Error(apiHandleError(error));
  }
};
export const userOutGroup = async () => {
  try {
    const response = await axios.put("/api/private/user/out-group", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result: User = response.data;
    return result;
  } catch (error) {
    throw new Error(apiHandleError(error));
  }
};
export const deleteUser = async () => {
  try {
    await axios.delete("/api/private/user", {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    throw new Error(apiHandleError(error));
  }
};

export const passwordChange = async (passwordChange: PasswordChange) => {
  try {
    const response = await axios.put(
      "/api/private/user/password/",
      passwordChange,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result: User = response.data;
    return result;
  } catch (error) {
    throw new Error(apiHandleError(error));
  }
};

export const getInitialAmount = async () => {
  try {
    const response = await axios.get("/api/private/group/initial-amount");

    const initialAmount: InitialAmount = response.data;

    return initialAmount.amount;
  } catch (error) {
    throw new Error(apiHandleError(error));
  }
};

export const putInitialAmount = async (amount: number) => {
  const initialAmount: InitialAmount = {
    amount: amount,
  };

  try {
    const response = await axios.put(
      "/api/private/group/initial-amount",
      initialAmount,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result: InitialAmount = response.data;

    return result.amount;
  } catch (error) {
    throw new Error(apiHandleError(error));
  }
};

export const getUserInviteUrl = async () => {
  try {
    const response = await axios.get("/api/private/user-invite-url");

    const inviteUrl: InviteUrl = response.data;

    return inviteUrl.url;
  } catch (error) {
    throw new Error(apiHandleError(error));
  }
};
export const postInviteToken = async (token: string) => {
  const inviteToken: InviteToken = {
    token: token,
  };

  try {
    const response = await axios.post(
      "/api/public/invite-cookie",
      inviteToken,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    throw new Error(apiHandleError(error));
  }
};
export const deleteInviteToken = async () => {
  try {
    await axios.delete("/api/public/invite-cookie");
  } catch (error) {
    throw new Error(apiHandleError(error));
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
    throw new Error(apiHandleError(error));
  }
};

export const deleteLiquidation = async (id: number) => {
  try {
    await axios.delete(`/api/private/liquidation/${id}`);
  } catch (error) {
    throw new Error(apiHandleError(error));
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
    throw new Error(apiHandleError(error));
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
    throw new Error(apiHandleError(error));
  }
};

export const postOcrImageReceipt = async (formData: FormData) => {
  try {
    const response = await axios.post("/api/private/ocr/receipt", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const result: Receipt = response.data;
    return result;
  } catch (error) {
    throw new Error(apiHandleError(error));
  }
};
