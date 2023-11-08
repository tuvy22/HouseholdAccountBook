import axios from "axios";
import { GET_NG_MESSAGE } from "./apiHandleError";

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
