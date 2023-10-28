export interface IncomeAndExpense {
  id: number;
  date: Date;
  category: string;
  amount: number;
  memo: string;
  registerUserId: string;
}

export interface IncomeAndExpenseMonthlyTotal {
  yearMonth: string;
  totalAmount: number;
  groupId: number;
}

export interface User {
  id: string;
  name: string;
  groupId: number;
}
