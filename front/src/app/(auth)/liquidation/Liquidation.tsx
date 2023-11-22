"use client";

import SubmitButtonForm from "../../components/SubmitButtonForm";
import DateForm from "../income-and-expense/DateForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LiquidationSchema, liquidationSchema } from "./LiquidationSchema";
import {
  Button,
  Checkbox,
  Input,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@/app/materialTailwindExports";
import React, { useEffect, useState } from "react";
import { IncomeAndExpense, User } from "@/app/util/types";
import {
  getGroupAllUser,
  getIncomeAndExpenseMonthlyLiquidations,
} from "@/app/util/apiClient";
import { toDateObject, toDateString } from "@/app/util/util";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserProvider";
import { IncomeAndExpenseTable } from "@/app/components/IncomeAndExpenseTable";

export interface CheckedItems {
  [key: number]: boolean;
}

const Liquidation = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LiquidationSchema>({
    resolver: zodResolver(liquidationSchema),
    defaultValues: {
      fromDate: "",
      toDate: toDateString(new Date()),
    },
  });
  const [groupData, setGroupData] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User>();
  const [checkedItems, setCheckedItems] = useState<CheckedItems>({});

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleCheckboxChange = (id: number) => {
    console.log(id);
    setCheckedItems({
      ...checkedItems,
      [id]: !checkedItems[id],
    });
  };
  useEffect(() => {
    const fetchData = async () => {
      setGroupData(await getGroupAllUser());
    };
    fetchData();
  }, []);

  const router = useRouter();
  const loginUser = useUser().user;

  const [liquidationIncomeAndExpenses, setLiquidationIncomeAndExpenses] =
    useState<IncomeAndExpense[] | null>(null);

  const handleLiquidation = async () => {
    setOpenDeleteDialog(false);
    setLiquidationIncomeAndExpenses(null);
    //清算API呼び出し
    //await deleteIncomeAndExpense(deletedIncomeAndExpense.id);
  };

  // フォーム送信時の処理
  const onSubmit = async (data: LiquidationSchema) => {
    const liquidations = await getIncomeAndExpenseMonthlyLiquidations(
      data.fromDate,
      data.toDate,
      selectedUser?.id || ""
    );
    console.log(liquidations);
    setOpenDeleteDialog(true);
    setLiquidationIncomeAndExpenses(liquidations);
  };
  return (
    <>
      <form
        onSubmit={(e) => handleSubmit((data) => onSubmit(data))(e)}
        className="mt-5"
      >
        <div className="mx-auto max-w-2xl">
          <Typography variant="h2" className="text-xl text-center md:text-left">
            清算対象
          </Typography>
          <div className="flex flex-col flex-wrap justify-center gap-3 md:flex-row mt-6">
            <div className="flex flex-col flex-grow">
              <Input
                label="開始期間 (必須)"
                type="date"
                size="lg"
                crossOrigin={undefined}
                {...register("fromDate")}
              />
            </div>
            <div className="flex justify-center items-center">〜</div>
            <div className="flex flex-col flex-grow">
              <Input
                label="終了期間 (必須)"
                type="date"
                size="lg"
                crossOrigin={undefined}
                {...register("toDate")}
              />
            </div>
            <div className="flex flex-col flex-grow">
              <Menu>
                <MenuHandler>
                  <Button
                    variant="outlined"
                    color="red"
                    className="h-11 w-full md:w-28"
                  >
                    清算相手
                  </Button>
                </MenuHandler>
                <MenuList>
                  {groupData.map(
                    (groupUser, index: number) =>
                      groupUser.id != loginUser.id && (
                        <MenuItem
                          key={index}
                          onClick={() => setSelectedUser(groupUser)}
                          className={`py-2 my-1 ${
                            selectedUser === groupUser ? "bg-gray-200" : ""
                          }`}
                        >
                          <label className="flex cursor-pointer items-center gap-2 p-2">
                            {groupUser.name}
                          </label>
                        </MenuItem>
                      )
                  )}
                </MenuList>
              </Menu>
            </div>
            {errors.fromDate && (
              <div className="text-red-500 text-left w-full">
                {errors.fromDate.message}
              </div>
            )}
            {errors.toDate && (
              <div className="text-red-500  text-left w-full">
                {errors.toDate.message}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end mt-3">
          <SubmitButtonForm buttonName={"検索"} />
        </div>
      </form>
      {liquidationIncomeAndExpenses && (
        <IncomeAndExpenseTable
          fetchData={liquidationIncomeAndExpenses}
          isLiquidation={true}
          BillingPopoverNotBgGrayUserId={selectedUser?.id}
          checkedItems={checkedItems}
          handleCheckboxChange={handleCheckboxChange}
        />
        // <LiquidationDialog
        //   open={openDeleteDialog}
        //   handleOpen={() => setOpenDeleteDialog(!openDeleteDialog)}
        //   handleOk={handleLiquidation}
        //   data={liquidationIncomeAndExpenses}
        //   BillingPopoverNotBgGrayUserId={selectedUser?.id}
        //   checkedItems={checkedItems}
        //   handleCheckboxChange={handleCheckboxChange}
        // />
      )}
    </>
  );
};

export default Liquidation;
