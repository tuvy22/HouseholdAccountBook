export interface IncomeAndExpense {
  id: number;
  date: Date;
  category: string;
  amount: number;
  memo: string;
  registerUserId: string;
  registerUserName: string;
  billingUsers: IncomeAndExpenseBillingUser[];
}

export interface IncomeAndExpenseBillingUser {
  incomeAndExpenseID: number;
  userID: string;
  userName: string;
  amount: number;
  liquidationFg: boolean;
}

export interface IncomeAndExpenseMonthlyTotal {
  yearMonth: string;
  totalAmount: number;
}
export interface IncomeAndExpenseMonthlyCategory {
  yearMonth: string;
  category: string;
  categoryAmount: number;
}

export interface User {
  id: string;
  name: string;
  groupId: number;
  initialAmount: number;
}
export interface UserCreate {
  id: string;
  password: string;
  name: string;
}
export interface InviteUrl {
  url: string;
}

export interface InviteToken {
  token: string;
}
