"use client";

import { IncomeAndExpense } from "@/app/util/types";
import React, { useState } from "react";
import { deleteIncomeAndExpense } from "@/app/util/api";
import { useUser } from "@/app/context/UserProvider";
import { useRouter } from "next/navigation";
import { DeleteConfirmDialog } from "@/app/components/DeleteConfirmDialog";
import Delete from "@mui/icons-material/Delete";
import { Spinner } from "@/app/materialTailwindExports";

export default function DeleteIcon({
  incomeAndExpense,
}: {
  incomeAndExpense: IncomeAndExpense;
}) {
  const router = useRouter();
  const user = useUser().user;

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
        user.id === incomeAndExpense.registerUserId && (
          <Delete
            className="cursor-pointer hover:text-red-500"
            onClick={() => handleOpenDeleteDialog(incomeAndExpense)}
          />
        )
      ) : (
        <Spinner />
      )}

      {deletedIncomeAndExpense && (
        <DeleteConfirmDialog
          open={openDeleteDialog}
          handleOpen={() => setOpenDeleteDialog(!openDeleteDialog)}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
}