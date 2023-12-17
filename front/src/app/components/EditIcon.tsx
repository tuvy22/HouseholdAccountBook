"use client";

import { IncomeAndExpense, IncomeAndExpenseUpdate } from "@/app/util/types";
import ModeEdit from "@mui/icons-material/ModeEdit";
import React, { useState } from "react";
import { UpdateExpenseDialog } from "../(auth)/income-and-expense/UpdateExpenseDialog";
import { putIncomeAndExpense } from "@/app/util/apiClient";
import { useUser } from "@/app/context/UserProvider";
import { useRouter } from "next/navigation";
import { Spinner } from "@/app/materialTailwindExports";
import { addError, useAlert } from "../context/AlertProvider";
import { AlertValue } from "./AlertCustoms";

export default function EditIcon({
  incomeAndExpense,
}: {
  incomeAndExpense: IncomeAndExpense;
}) {
  const router = useRouter();
  const user = useUser().user;
  const alert = useAlert();

  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [updatedIncomeAndExpense, setUpdatedIncomeAndExpense] =
    useState<IncomeAndExpense | null>(null);

  const handleOpenUpdateDialog = (incomeAndExpense: IncomeAndExpense) => {
    setUpdatedIncomeAndExpense(incomeAndExpense);
    setOpenUpdateDialog(true);
  };

  const handleUpdate = async (
    id: number,
    updatedIncomeAndExpense: IncomeAndExpenseUpdate
  ) => {
    if (updatedIncomeAndExpense) {
      try {
        await putIncomeAndExpense(id, updatedIncomeAndExpense);

        setOpenUpdateDialog(false);
        setUpdatedIncomeAndExpense(null);
        //リフレッシュ
        router.refresh();
      } catch (error) {
        if (error instanceof Error) {
          addError(error.message, alert);
        }
      }
    }
  };
  return (
    <>
      {user.id !== null ? (
        user.id === incomeAndExpense.registerUserID && (
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
          incomeAndExpense={updatedIncomeAndExpense}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}
