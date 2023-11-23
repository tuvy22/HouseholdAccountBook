"use client";

import React, { useEffect, useState } from "react";

import { IncomeAndExpenseTable } from "../../components/IncomeAndExpenseTable";
import { IncomeAndExpense } from "@/app/util/types";
import { CheckedItems } from "../liquidation/Liquidation";
import { Button, Typography } from "@/app/materialTailwindExports";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserProvider";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { isMinus } from "@/app/util/util";

export const LiquidationTable = ({
  liquidations,
  targetUserId,
}: {
  liquidations: IncomeAndExpense[];
  targetUserId: string;
}) => {
  const [checkedItems, setCheckedItems] = useState<CheckedItems>({});
  const [totalLiquidationAmount, setTotalLiquidationAmount] =
    useState<number>(0);
  const loginUser = useUser().user;
  const router = useRouter();

  //清算相手の名前の取得
  let targetUserName = "";
  const ieFound = liquidations.find((ie) => ie.registerUserId === targetUserId);
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

  //チェックボックス変更時
  const handleCheckboxChange = (id: number) => {
    const newCheckedItems = {
      ...checkedItems,
      [id]: !checkedItems[id],
    };

    setCheckedItems(newCheckedItems);
    const checkKeys = Object.keys(newCheckedItems).filter(
      (key) => newCheckedItems[Number(key)]
    );

    //清算額計算
    setTotalLiquidationAmount(0);
    for (let l of liquidations) {
      l.billingUsers.forEach((bu) => {
        if (
          l.registerUserId === bu.userID ||
          !checkKeys.includes(bu.incomeAndExpenseID.toString())
        ) {
          return;
        }

        const amount = bu.userID === loginUser.id ? bu.amount : -bu.amount;
        setTotalLiquidationAmount((total) => total + amount);
      });
    }
  };

  const handleLiquidation = () => {
    router.push("/liquidation");
  };

  return (
    <>
      <div className="flex justify-between">
        <div>
          <Typography variant="h4" color="gray">
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
              router.push("/liquidation");
            }}
            size="lg"
            className=" w-full md:w-28 row-span-3"
          >
            {"戻る"}
          </Button>
        </div>
      </div>

      <IncomeAndExpenseTable
        fetchData={liquidations}
        isLiquidation={true}
        BillingPopoverNotBgGrayUserId={targetUserId}
        checkedItems={checkedItems}
        handleCheckboxChange={handleCheckboxChange}
      />
      {totalLiquidationAmount !== 0 && (
        <div className="sticky bottom-0 left-0 right-0 z-30 bg-gray-50 bg-opacity-80 px-3 py-2 mt-8 ">
          <div className="grid grid-cols-[1fr_auto_1fr_auto_auto] grid-rows[auto_auto_auto] gap-3 justify-center items-center text-center">
            <Typography
              color="gray"
              className="text-left col-span-3 text-lg font-bold"
            >
              清算情報
            </Typography>
            <Button
              variant="text"
              color="red"
              onClick={() => {
                router.push("/liquidation");
              }}
              size="lg"
              className=" w-full md:w-28 row-span-3"
            >
              {"戻る"}
            </Button>
            <Button
              variant="gradient"
              color="green"
              size="lg"
              className="w-full md:w-28 row-span-3"
              onClick={() => {
                handleLiquidation();
              }}
            >
              {"清算"}
            </Button>

            <Typography color="gray">{loginUser.name}</Typography>
            <div>
              {!isMinus(totalLiquidationAmount) ? (
                <ArrowBackIcon />
              ) : (
                <ArrowForwardIcon />
              )}
            </div>
            <Typography color="gray">{targetUserName}</Typography>

            <div className="col-span-3 text-red-500">{`${totalLiquidationAmount}円`}</div>
          </div>
        </div>
      )}
    </>
  );
};
