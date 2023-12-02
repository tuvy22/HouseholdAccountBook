"use client";

import { IncomeAndExpense } from "@/app/util/types";
import React, { useState } from "react";
import { deleteIncomeAndExpense } from "@/app/util/apiClient";
import { useUser } from "@/app/context/UserProvider";
import { useRouter } from "next/navigation";
import { IncomeAndExpenseConfirmDialog } from "@/app/components/IncomeAndExpenseConfirmDialog";
import Delete from "@mui/icons-material/Delete";
import { Spinner } from "@/app/materialTailwindExports";

export default function IncomeAndExpenseDeleteIcon({
  incomeAndExpense,
}: {
  incomeAndExpense: IncomeAndExpense;
}) {
  const router = useRouter();
  const user = useUser().user;

  const isLiquidationID = incomeAndExpense.billingUsers.some((data) => {
    return data.liquidationID > 0;
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletedIncomeAndExpense, setDeletedIncomeAndExpense] =
    useState<IncomeAndExpense | null>(null);

  const handleOpenDeleteDialog = (incomeAndExpense: IncomeAndExpense) => {
    setDeletedIncomeAndExpense(incomeAndExpense);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (deletedIncomeAndExpense) {
      await deleteIncomeAndExpense(deletedIncomeAndExpense.id);
      setOpenDeleteDialog(false);
      setDeletedIncomeAndExpense(null);

      //リフレッシュ
      router.refresh();
    }
  };
  return (
    <>
      {user.id !== null ? (
        <Delete
          className={`cursor-pointer hover:text-red-500 ${
            user.id === incomeAndExpense.registerUserID && !isLiquidationID
              ? ""
              : "invisible"
          }`}
          onClick={() => handleOpenDeleteDialog(incomeAndExpense)}
        />
      ) : (
        <Spinner />
      )}
      {deletedIncomeAndExpense && (
        <IncomeAndExpenseConfirmDialog
          open={openDeleteDialog}
          handleOpen={() => setOpenDeleteDialog(!openDeleteDialog)}
          handleOk={handleDelete}
          title="削除の確認"
          message="本当にこのデータを削除してよろしいですか？"
          cancelBtnName="キャンセル"
          okBtnName="削除"
        />
      )}
    </>
  );
}
