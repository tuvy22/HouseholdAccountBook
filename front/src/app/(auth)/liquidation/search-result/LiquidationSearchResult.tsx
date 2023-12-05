"use client";

import React, { useCallback, useEffect, useState } from "react";

import { IncomeAndExpenseTable } from "../../../components/IncomeAndExpenseTable";
import { IncomeAndExpense, LiquidationCreate } from "@/app/util/types";
import { Button, Card, Typography } from "@/app/materialTailwindExports";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserProvider";

import { IncomeAndExpenseConfirmDialog } from "@/app/components/IncomeAndExpenseConfirmDialog";
import { postLiquidation } from "@/app/util/apiClient";
import { AlertValue } from "@/app/components/AlertCustoms";
import { addError, addSuccess, useAlert } from "@/app/context/AlertProvider";
import LiquidationFlow from "../LiquidationFlow";

export interface CheckedItems {
  [key: number]: boolean;
}

export const LiquidationSearchResult = ({
  liquidations,
  targetUserId,
}: {
  liquidations: IncomeAndExpense[];
  targetUserId: string;
}) => {
  const [checkedItems, setCheckedItems] = useState<CheckedItems>({});
  const [allCheckBox, setAllCheckBox] = useState<boolean>(true);
  const [postBillingUserId, setPostBillingUserId] = useState<number[]>([]);
  const [totalLiquidationAmount, setTotalLiquidationAmount] =
    useState<number>(0);
  const loginUser = useUser().user;
  const router = useRouter();
  const alert = useAlert();

  const [openDialog, setOpenDialog] = useState(false);

  //清算相手の名前の取得
  let targetUserName = "";
  const ieFound = liquidations.find((ie) => ie.registerUserID === targetUserId);
  if (ieFound) {
    targetUserName = ieFound.registerUserName;
  } else {
    const buFound = liquidations
      .flatMap((ie) => ie.billingUsers)
      .find((bu) => bu.userID === targetUserId);
    if (buFound) {
      targetUserName = buFound.userName;
    }
  }

  //全選択チェックの変更
  const handleAllCheckBoxChange = (check: boolean) => {
    let newItems: CheckedItems;
    newItems = check ? checkAll() : uncheckAll();

    //チェックボックスの更新
    setAllCheckBox(check);
    setCheckedItems(newItems);

    //精算額の更新
    clacTotalLiquidationAmount(newItems);
  };

  // 全てチェックをつける関数
  const checkAll = () => {
    const newItems = { ...checkedItems };
    Object.keys(newItems).forEach((key) => {
      newItems[Number(key)] = true;
    });

    return newItems;
  };

  // 全てのチェックを外す関数
  const uncheckAll = () => {
    const newItems = { ...checkedItems };
    Object.keys(newItems).forEach((key) => {
      newItems[Number(key)] = false;
    });
    return newItems;
  };

  // 清算額計算
  const clacTotalLiquidationAmount = useCallback(
    (newCheckedItems: CheckedItems) => {
      const checkKeys = Object.keys(newCheckedItems).filter(
        (key) => newCheckedItems[Number(key)]
      );

      //計算前に初期化
      setTotalLiquidationAmount(0);
      setPostBillingUserId([]);

      for (let l of liquidations) {
        l.billingUsers.forEach((bu) => {
          if (
            //清算対象のbillingUsers以外は対象外
            (loginUser.id === l.registerUserID
              ? targetUserId !== bu.userID
              : loginUser.id !== bu.userID) ||
            //チェックしてないのは対象外
            !checkKeys.includes(bu.incomeAndExpenseID.toString())
          ) {
            return;
          }

          //計算
          const amount = bu.userID === loginUser.id ? bu.amount : -bu.amount;

          //計算結果格納
          setTotalLiquidationAmount((total) => total + amount);
          setPostBillingUserId((postBillingUserId) => [
            ...postBillingUserId,
            bu.id,
          ]);
        });
      }
    },
    [liquidations, loginUser.id, targetUserId]
  );

  //チェックボックス変更時
  const handleCheckboxChange = (id: number) => {
    const newCheckedItems = {
      ...checkedItems,
      [id]: !checkedItems[id],
    };

    setCheckedItems(newCheckedItems);
    clacTotalLiquidationAmount(newCheckedItems);
  };

  useEffect(() => {
    const newCheckedItems =
      createCheckedItemsFromIncomeAndExpenses(liquidations);
    setCheckedItems(newCheckedItems);

    clacTotalLiquidationAmount(newCheckedItems);
  }, [clacTotalLiquidationAmount, liquidations]);

  //チェックボックスの初期化
  const createCheckedItemsFromIncomeAndExpenses = (
    incomeAndExpenses: IncomeAndExpense[]
  ): CheckedItems => {
    const checkedItems: CheckedItems = {};
    incomeAndExpenses.forEach((incomeAndExpense) => {
      //全てチェック
      checkedItems[incomeAndExpense.id] = true;
    });
    return checkedItems;
  };

  //清算送信の処理
  const handleLiquidation = async () => {
    const data: LiquidationCreate = {
      date: new Date(),
      billingUsersIds: postBillingUserId,
      targetUserID: targetUserId,
      registerUserID: loginUser.id,
    };
    try {
      await postLiquidation(data);

      //結果アラート
      addSuccess("清算が完了しました。", alert);
    } catch (error) {
      if (error instanceof Error) {
        addError(error.message, alert);
      }
    }

    router.refresh();
    router.push("/liquidation");
  };

  return (
    <>
      <div className="flex justify-between">
        <div>
          <Typography className="text-xl text-center md:text-left">
            清算対象選択
          </Typography>
          <Typography color="gray" className="mt-1 font-normal">
            以下から清算対象を選択した後、清算ボタンを押してください
          </Typography>
        </div>
        <div className="flex items-end">
          <Button
            variant="text"
            color="red"
            onClick={() => {
              router.push("/liquidation/search");
            }}
            size="lg"
            className=" w-full md:w-28 row-span-3"
          >
            {"戻る"}
          </Button>
        </div>
      </div>

      <IncomeAndExpenseTable
        tableData={liquidations}
        isLiquidation={true}
        loginUserId={loginUser.id}
        targetUserId={targetUserId}
        checkedItems={checkedItems}
        handleCheckboxChange={handleCheckboxChange}
        allCheckBox={allCheckBox}
        handleAllCheckBoxChange={handleAllCheckBoxChange}
      />
      {totalLiquidationAmount !== 0 && (
        <Card className="sticky bottom-0 left-0 right-0 z-30 bg-white bg-opacity-80 px-3 py-2 mt-8 ">
          <div className="grid grid-cols-[5fr_2fr_auto] grid-rows[auto_auto] gap-3 justify-center items-center text-center">
            <Typography
              color="gray"
              className="text-left col-span-4 text-lg font-bold"
            >
              <span>清算情報</span>
            </Typography>
            <div className="">
              <LiquidationFlow
                registerUserName={loginUser.name}
                targetUserName={targetUserName}
                amount={totalLiquidationAmount}
              />
            </div>
            <div className="row-span-2"></div>
            <Button
              variant="gradient"
              color="green"
              size="lg"
              className="w-full md:w-28"
              onClick={() => {
                setOpenDialog(true);
              }}
            >
              {"清算"}
            </Button>
          </div>
        </Card>
      )}
      <IncomeAndExpenseConfirmDialog
        open={openDialog}
        handleOpen={() => setOpenDialog(!openDialog)}
        handleOk={handleLiquidation}
        title="清算確認"
        message="清算金額を実際にやり取りした後に清算ボタンを押してください。"
        cancelBtnName="キャンセル"
        okBtnName="清算"
        isOkBtnFocus={true}
      />
    </>
  );
};
