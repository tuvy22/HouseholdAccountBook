export interface IncomeAndExpense {
  id: number;
  date: string;
  category: string;
  amount: number;
  memo: string;
  registerUserId: string;
}

export interface User {
  id: string;
  name: string;
  groupId: number;
}
