"use client";

import { Liquidation } from "@/app/util/types";
import React, { useState } from "react";
import { deleteLiquidation } from "@/app/util/apiClient";
import { useUser } from "@/app/context/UserProvider";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/app/components/ConfirmDialog";
import { Spinner } from "@/app/materialTailwindExports";
import ClearIcon from "@mui/icons-material/Clear";
import { addError, useAlert } from "../context/AlertProvider";

export default function LiquidationDeleteIcon({
  liquidation,
}: {
  liquidation: Liquidation;
}) {
  const router = useRouter();
  const user = useUser().user;
  const alert = useAlert();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletedLiquidation, setDeletedLiquidation] =
    useState<Liquidation | null>(null);

  const handleOpenDeleteDialog = (liquidation: Liquidation) => {
    setDeletedLiquidation(liquidation);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (deletedLiquidation) {
      try {
        await deleteLiquidation(deletedLiquidation.id);
      } catch (error) {
        if (error instanceof Error) {
          addError(error.message, alert);
        }
      }

      setOpenDeleteDialog(false);
      setDeletedLiquidation(null);

      //リフレッシュ
      router.refresh();
    }
  };
  return (
    <>
      {user.id !== null ? (
        user.id === liquidation.registerUserID && (
          <ClearIcon
            className="cursor-pointer hover:text-red-500"
            onClick={() => handleOpenDeleteDialog(liquidation)}
          />
        )
      ) : (
        <Spinner />
      )}

      {deletedLiquidation && (
        <ConfirmDialog
          open={openDeleteDialog}
          handleOpen={() => setOpenDeleteDialog(!openDeleteDialog)}
          handleOk={handleDelete}
          title="取消し確認"
          message="本当にこの精算を取消してよろしいですか？"
          cancelBtnName="キャンセル"
          okBtnName="精算取消し"
        />
      )}
    </>
  );
}
