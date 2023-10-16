
export interface Expense {
  id : number
  date: string;
  category: string;
  amount: number;
  memo: string;
  sortAt: string;
  registerUserId: string;
  hasPlusAmount:boolean
}


export interface User {
  id: string
  name: string;
  groupId: number;
}
