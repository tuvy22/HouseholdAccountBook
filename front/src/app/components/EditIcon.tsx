"use client";

import { IncomeAndExpense } from "@/app/util/types";
import ModeEdit from "@mui/icons-material/ModeEdit";
import React, { useState } from "react";
import { UpdateExpenseDialog } from "../(auth)/income-and-expense/list/UpdateExpenseDialog";
import { putIncomeAndExpense } from "@/app/util/api";
import { useUser } from "@/app/context/UserProvider";
import { useRouter } from "next/navigation";
import { Spinner } from "@/app/materialTailwindExports";

export default function EditIcon({
  incomeAndExpense,
}: {
  incomeAndExpense: IncomeAndExpense;
}) {
  const router = useRouter();
  const user = useUser().user;

  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [updatedIncomeAndExpense, setUpdatedIncomeAndExpense] =
    useState<IncomeAndExpense | null>(null);

  const handleOpenUpdateDialog = (incomeAndExpense: IncomeAndExpense) => {
    setUpdatedIncomeAndExpense(incomeAndExpense);
    setOpenUpdateDialog(true);
  };

  const handleUpdate = async (updatedIncomeAndExpense: IncomeAndExpense) => {
    if (updatedIncomeAndExpense) {
      await putIncomeAndExpense(updatedIncomeAndExpense);
      setOpenUpdateDialog(false);
      setUpdatedIncomeAndExpense(null);

      //リフレッシュ
      router.refresh();
    }
  };
  return (
    <>
      {user.id !== null ? (
        user.id === incomeAndExpense.registerUserId && (
          <ModeEdit
            className="cursor-pointer hover:text-green-500"
            onClick={() => handleOpenUpdateDialog(incomeAndExpense)}
          />
        )
      ) : (
        <Spinner />
      )}
      {updatedIncomeAndExpense && (
        <UpdateExpenseDialog
          open={openUpdateDialog}
          handleOpen={() => setOpenUpdateDialog(!openUpdateDialog)}
          updatedIncomeAndExpense={updatedIncomeAndExpense}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}
