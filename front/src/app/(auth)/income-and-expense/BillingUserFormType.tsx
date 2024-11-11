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

  users.forEach((user) => {
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

  users.forEach((user) => {
    const hitBu = billingUser.find((bu) => user.id === bu.userID);

    const billingUserTmp: BillingUserFormType = {
      userID: hitBu ? hitBu.userID : user.id,
      name: hitBu ? hitBu.userName : user.name,
      checked: hitBu ? true : false,
      disabled: hitBu?.liquidationID || 0 > 0 ? true : false,
      amount: hitBu ? (-hitBu.amount).toString() : "0",
      amountLock: hitBu?.liquidationID || 0 > 0 ? true : false,
      id: hitBu ? hitBu.id : 0,
      liquidationID: hitBu ? hitBu.liquidationID : 0,
    };
    billingUserTemps.push(billingUserTmp);
  });

  //今はグループにいないユーザーの項目追加
  billingUser.forEach((bu) => {
    const isOutGroupUser = !users.some((user) => user.id === bu.userID);
    if (isOutGroupUser) {
      const billingUserTmp: BillingUserFormType = {
        userID: bu.userID,
        name: bu.userName,
        checked: true,
        disabled: bu.liquidationID > 0 ? true : false,
        amount: (-bu.amount).toString(),
        amountLock: bu.liquidationID > 0 ? true : false,
        id: bu.id,
        liquidationID: bu.liquidationID,
      };
      billingUserTemps.push(billingUserTmp);
    }
  });

  return billingUserTemps;
}

export function convertToBillingUsers(
  billingFormUsers: BillingUserFormType[],
  isMinus: boolean
): IncomeAndExpenseBillingUser[] {
  let result: IncomeAndExpenseBillingUser[] = [];

  billingFormUsers.map((buForm) => {
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

//金額分配関数
export function distributionAmount(
  billingUsers: BillingUserFormType[] | IncomeAndExpenseBillingUser[],
  remainingAmount: number
) {
  const remainder = remainingAmount % billingUsers.length; //余り
  const amountPerUser = Math.floor(remainingAmount / billingUsers.length); //分配金額

  // 余りは上から分配する
  billingUsers.forEach((user, index) => {
    const amount =
      index < Math.abs(remainder) ? amountPerUser + 1 : amountPerUser;
    if ("onlyBillingUserFormTypeProp" in user) {
      user.amount = amount.toString();
    } else {
      user.amount = amount;
    }
  });
}
