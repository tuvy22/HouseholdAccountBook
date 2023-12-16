"use client";

import { addError, addSuccess, useAlert } from "@/app/context/AlertProvider";
import { ConfirmDialog } from "@/app/components/ConfirmDialog";
import { useState } from "react";
import { Button } from "@/app/materialTailwindExports";
import { useRouter } from "next/navigation";
import { authDel, deleteUser } from "@/app/util/apiClient";

export function UserDelete() {
  const alert = useAlert();
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();

  const onSubmit = async () => {
    try {
      await deleteUser();
      router.push("/login");
    } catch (error) {
      if (error instanceof Error) {
        addError(error.message, alert);
      }
    }
    setOpenDialog(false);
  };
  return (
    <>
      <div className="w-full max-w-sm mx-auto">
        <div className="flex justify-center">
          <Button
            variant="filled"
            color={"green"}
            size="lg"
            className="mt-4 w-full md:w-28"
            onClick={() => setOpenDialog(true)}
          >
            {"退会"}
          </Button>
        </div>
      </div>
      <ConfirmDialog
        open={openDialog}
        handleOpen={() => setOpenDialog(!openDialog)}
        handleOk={onSubmit}
        title="退会確認"
        message="本当に退会してよろしいですか？"
        cancelBtnName="キャンセル"
        okBtnName="退会"
      />
    </>
  );
}
