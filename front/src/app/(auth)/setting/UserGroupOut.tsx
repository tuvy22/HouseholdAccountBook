"use client";

import { addError, addSuccess, useAlert } from "@/app/context/AlertProvider";
import { ConfirmDialog } from "@/app/components/ConfirmDialog";
import { useEffect, useState } from "react";
import { Button } from "@/app/materialTailwindExports";
import { getGroupAllUser, userOutGroup } from "@/app/util/apiClient";
import { useUser } from "@/app/context/UserProvider";

export function UserGroupOut() {
  const alert = useAlert();
  const [openDialog, setOpenDialog] = useState(false);
  const [allowGroupOut, setAllowGroupOut] = useState(false);
  const user = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getGroupAllUser();
        //複数人のグループの場合のみ脱退を許可
        setAllowGroupOut(users.length > 1);
      } catch (error) {
        if (error instanceof Error) {
          addError(error.message, alert);
        }
      }
    };
    fetchData();
  }, [alert, user]);

  const onSubmit = async () => {
    try {
      const updatedUser = await userOutGroup();
      user.setUser(updatedUser);

      //結果アラート
      addSuccess("グループから脱退しました。", alert);
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
            disabled={!allowGroupOut}
            onClick={() => setOpenDialog(true)}
          >
            {"脱退"}
          </Button>
        </div>
      </div>
      <ConfirmDialog
        open={openDialog}
        handleOpen={() => setOpenDialog(!openDialog)}
        handleOk={onSubmit}
        title="グループ脱退確認"
        message="本当に現在所属するグループから脱退してよろしいですか？"
        cancelBtnName="キャンセル"
        okBtnName="脱退"
      />
    </>
  );
}
