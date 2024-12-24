export interface IncomeAndExpense {
  id: number;
  date: Date;
  category: string;
  amount: number;
  memo: string;
  registerUserID: string;
  registerUserName: string;
  billingUsers: IncomeAndExpenseBillingUser[];
}

export interface IncomeAndExpenseCreate {
  date: string;
  category: string;
  amount: number;
  memo: string;
  registerUserID: string;
  billingUsers: IncomeAndExpenseBillingUser[];
}
export interface IncomeAndExpenseUpdate {
  date: string;
  category: string;
  amount: number;
  memo: string;
  billingUsers: IncomeAndExpenseBillingUser[];
}

export interface Liquidation {
  id: number;
  date: Date;
  registerUserID: string;
  registerUserName: string;
  targetUserID: string;
  targetUserName: string;
  billingUsers: IncomeAndExpenseBillingUser[];
}

export interface LiquidationCreate {
  date: Date;
  registerUserID: string;
  targetUserID: string;
  billingUsersIds: number[];
}

export interface IncomeAndExpenseBillingUser {
  id: number;
  incomeAndExpenseID: number;
  userID: string;
  userName: string;
  amount: number;
  liquidationID: number;
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
}
export interface UserCreate {
  id: string;
  password: string;
  name: string;
}

export interface PasswordChange {
  prePassword: string;
  password: string;
}

export interface UserUpdate {
  name: string;
}

export interface InviteUrl {
  url: string;
}

export interface InviteToken {
  token: string;
}

export interface InitialAmount {
  amount: number;
}

export interface Category {
  id: number;
  name: string;
  groupId: number;
  isExpense: boolean;
}

export interface Receipt {
  storeName: string;
  totalAmount: number;
}
