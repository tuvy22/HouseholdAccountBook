"use client";

import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

type Props = {
  open: boolean;
  handleOpen: () => void;
  onConfirm: () => void;
};

export const DeleteConfirmDialog: React.FC<Props> = ({
  open,
  handleOpen,
  onConfirm,
}) => {
  return (
    <>
      <Dialog open={open} handler={handleOpen} size={"xs"}>
        <DialogHeader>削除の確認</DialogHeader>
        <DialogBody divider>
          本当にこのデータを削除してよろしいですか？
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => {
              handleOpen();
            }}
            className="mr-1"
          >
            キャンセル
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={() => {
              onConfirm();
              handleOpen();
            }}
          >
            削除
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};
