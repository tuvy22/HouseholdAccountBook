import { IncomeAndExpenseBillingUser, User } from "@/app/util/types";

export interface BillingUserFormType {
  id: number;
  userID: string;
  name: string;
  checked: boolean;
  disabled: boolean;
  amount: string;
  liquidationID: number;
  amountLock: boolean;
}
export function convertUserToBillingUserForms(
  users: User[],
  iniCheckUserID: string,
  iniCheckUserTotalAmount: string
): BillingUserFormType[] {
  const billingUserTemps: BillingUserFormType[] = [];

  users.forEach((user: User) => {
    const billingUserTmp: BillingUserFormType = {
      id: 0,
      userID: user.id,
      name: user.name,
      checked: iniCheckUserID === user.id,
      amount: iniCheckUserID === user.id ? iniCheckUserTotalAmount : "",
      liquidationID: 0,
      disabled: false,
      amountLock: false,
    };
    billingUserTemps.push(billingUserTmp);
  });
  return billingUserTemps;
}

export function convertBillingUserToBillingUserForms(
  users: User[],
  billingUser: IncomeAndExpenseBillingUser[]
): BillingUserFormType[] {
  const billingUserTemps: BillingUserFormType[] = [];

  users.forEach((user: User) => {
    const hitBu = billingUser.find(
      (bu: IncomeAndExpenseBillingUser) => user.id === bu.userID
    );

    const billingUserTmp: BillingUserFormType = {
      userID: hitBu ? hitBu.userID : user.id,
      name: hitBu ? hitBu.userName : user.name,
      checked: hitBu ? true : false,
      disabled: hitBu?.liquidationID || 0 > 0 ? true : false,
      amount: hitBu ? (-hitBu.amount).toString() : "0",
      amountLock: hitBu ? true : false,
      id: hitBu ? hitBu.id : 0,
      liquidationID: hitBu ? hitBu.liquidationID : 0,
    };
    billingUserTemps.push(billingUserTmp);
  });
  return billingUserTemps;
}

export function convertToBillingUsers(
  billingFormUsers: BillingUserFormType[],
  isMinus: boolean
): IncomeAndExpenseBillingUser[] {
  let result: IncomeAndExpenseBillingUser[] = [];

  billingFormUsers.map((buForm: BillingUserFormType) => {
    if (buForm.checked) {
      const newBillingUser: IncomeAndExpenseBillingUser = {
        incomeAndExpenseID: 0,
        userID: buForm.userID,
        amount: isMinus
          ? -parseInt(buForm.amount, 10) || 0
          : parseInt(buForm.amount, 10) || 0,
        userName: "",
        id: buForm.id,
        liquidationID: buForm.liquidationID,
      };
      result = [...result, newBillingUser];
    }
  });
  return result;
}
