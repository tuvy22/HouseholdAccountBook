"use client";

import { useUser } from "@/app/context/UserProvider";
import {
  Menu,
  MenuHandler,
  Button,
  MenuList,
  MenuItem,
  Checkbox,
  Input,
} from "@/app/materialTailwindExports";
import { getGroupAllUser } from "@/app/util/apiClient";
import { IncomeAndExpenseBillingUser, User } from "@/app/util/types";
import React, { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { UseFormWatch } from "react-hook-form";
import { IncomeExpenseSchema } from "./IncomeAndExpenseSchema";
import {
  BillingUserFormType,
  convertBillingUserToBillingUserForms,
  convertUserToBillingUserForms,
} from "./BillingUserFormType";
import { addError, useAlert } from "@/app/context/AlertProvider";

export function BillingUserForm({
  watch,
  billingUsers,
  setBillingUsers,
  isUpdate,
  updatePreBillingUser = [],
}: {
  watch: UseFormWatch<IncomeExpenseSchema>;
  billingUsers: BillingUserFormType[];
  setBillingUsers: Dispatch<SetStateAction<BillingUserFormType[]>>;
  isUpdate: boolean;
  updatePreBillingUser?: IncomeAndExpenseBillingUser[];
}) {
  const loginUser = useUser().user;
  const [groupUsers, setGroupUser] = useState<User[]>([]);
  const totalAmountStr = watch("amount");
  const alert = useAlert();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setGroupUser(await getGroupAllUser());
      } catch (error) {
        if (error instanceof Error) {
          addError(error.message, alert);
        }
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isUpdate) {
      setBillingUsers(
        convertBillingUserToBillingUserForms(groupUsers, updatePreBillingUser)
      );
    }
  }, [
    groupUsers,
    isUpdate,
    setBillingUsers,
    updatePreBillingUser,
    totalAmountStr,
  ]);

  useEffect(() => {
    if (!isUpdate) {
      setBillingUsers(
        convertUserToBillingUserForms(groupUsers, loginUser.id, totalAmountStr)
      );
    }
  }, [groupUsers, isUpdate, loginUser.id, setBillingUsers, totalAmountStr]);

  //チェックボックス変更時
  const handleCheckboxChange = (changedBillingUser: BillingUserFormType) => {
    const updatedBillingUsers = billingUsers.map((user) => {
      if (user.userID === changedBillingUser.userID) {
        return {
          ...user,
          checked: !user.checked,
          amountLock: false, //変更した場合、金額ロックは外れる
          amount: user.checked ? "" : user.amount, //外した場合は、金額は空
        };
      } else {
        return user;
      }
    });

    const totalAmount = parseInt(totalAmountStr, 10) || 0;
    //分配処理
    setBillingUsers(distributeAmounts(updatedBillingUsers, totalAmount));
  };

  const handleAmountChange = (
    changedBillingUser: BillingUserFormType,
    changeAmountStr: string
  ) => {
    let changeAmount = parseInt(changeAmountStr, 10);
    const totalAmount = parseInt(totalAmountStr, 10) || 0;

    //エラー制御
    if (isNaN(changeAmount)) {
      changeAmountStr = "";
      changeAmount = 0;
    }

    if (changeAmount < 0) {
      //最大、最小設定
      changeAmountStr = "0";
    } else if (changeAmount > totalAmount) {
      changeAmountStr = totalAmountStr;
    }

    // 金額を変更したユーザーのamountLockをtrueに設定
    const updatedUsers = billingUsers.map((billingUser) =>
      billingUser.userID === changedBillingUser.userID
        ? { ...billingUser, amount: changeAmountStr, amountLock: true }
        : billingUser
    );
    //分配処理
    setBillingUsers(distributeAmounts(updatedUsers, totalAmount));
  };

  //分配関数
  const distributeAmounts = (
    billingUsers: BillingUserFormType[],
    totalAmount: number
  ) => {
    //アンロックユーザー（分配対象を取得）
    let unlockedUsers = billingUsers.filter(
      (user) => !user.amountLock && user.checked
    );

    // 全てロックされている場合、非活性以外の全てのロックを解除
    if (unlockedUsers.length === 0) {
      billingUsers.forEach((user) => {
        if (!user.disabled) {
          user.amountLock = false;
        }
      });
      //金額分配対象取得
      unlockedUsers = billingUsers.filter(
        (user) => !user.amountLock && user.checked
      );
    }

    // ロックユーザーの金額を合計
    const lockedAmountTotal = billingUsers.reduce((total, user) => {
      return user.amountLock ? total + parseInt(user.amount, 10) || 0 : total;
    }, 0);

    // 総額からロックされた金額を引く
    const remainingAmount = totalAmount - lockedAmountTotal;
    const amountPerUser = Math.floor(remainingAmount / unlockedUsers.length);
    const remainder = remainingAmount % unlockedUsers.length;

    // ロックされていないユーザー間で余りを分配
    unlockedUsers.forEach((user, index) => {
      user.amount =
        index < remainder
          ? (amountPerUser + 1).toString()
          : amountPerUser.toString();
    });

    return billingUsers;
  };

  return (
    <>
      {groupUsers.length > 1 ? (
        <>
          <Menu>
            <MenuHandler>
              <Button
                variant="outlined"
                color="red"
                className="h-11 w-full md:w-28"
              >
                立替入力
              </Button>
            </MenuHandler>
            <MenuList className="z-[10000] max-h-96">
              {billingUsers.map((billingUser, index: number) => (
                <React.Fragment key={index}>
                  <MenuItem className="py-2 my-1">
                    <label
                      key={index}
                      htmlFor={billingUser.userID}
                      className="flex cursor-pointer items-center gap-2 p-2"
                    >
                      <Checkbox
                        ripple={false}
                        id={billingUser.userID}
                        value={billingUser.userID}
                        containerProps={{ className: "p-0" }}
                        className="hover:before:content-none"
                        crossOrigin={undefined}
                        disabled={billingUser.disabled}
                        checked={billingUser.checked}
                        onChange={() => handleCheckboxChange(billingUser)}
                      />
                      {billingUser.name}
                    </label>
                    <Input
                      label="金額"
                      type="number"
                      value={billingUser.amount}
                      size="lg"
                      crossOrigin={undefined}
                      disabled={!billingUser.checked || billingUser.disabled}
                      onChange={(e) =>
                        handleAmountChange(billingUser, e.target.value)
                      }
                    />

                    {(parseInt(billingUser.amount, 10) || 0) < 0 && (
                      <div className="text-red-500">
                        マイナスは修正が必要です。
                      </div>
                    )}
                  </MenuItem>
                </React.Fragment>
              ))}
            </MenuList>
          </Menu>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
