"use client";

import React, { useEffect, useRef } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "../materialTailwindExports";

type Props = {
  title: string;
  message: string;
  cancelBtnName: string;
  okBtnName: string;
  open: boolean;
  handleOpen: () => void;
  handleCancel?: () => void;
  handleOk: () => void;
  isOkBtnFocus?: boolean;
};

export const IncomeAndExpenseConfirmDialog: React.FC<Props> = ({
  title,
  message,
  cancelBtnName,
  okBtnName,
  open,
  handleOpen,
  handleCancel = () => {},
  handleOk,
  isOkBtnFocus = false,
}) => {
  const okButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        if (isOkBtnFocus && okButtonRef.current) {
          okButtonRef.current.focus();
        } else if (cancelButtonRef.current) {
          cancelButtonRef.current.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open, isOkBtnFocus]);
  return (
    <>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>{title}</DialogHeader>
        <DialogBody divider>{message}</DialogBody>
        <DialogFooter className="flex flex-col md:flex-row gap-3">
          <Button
            variant="gradient"
            color="green"
            ref={okButtonRef}
            className="w-full md:w-auto"
            onClick={() => {
              handleOk();
              handleOpen();
            }}
          >
            {okBtnName}
          </Button>
          <Button
            variant="outlined"
            color="red"
            className="w-full md:w-auto"
            ref={cancelButtonRef}
            onClick={() => {
              handleCancel();
              handleOpen();
            }}
          >
            {cancelBtnName}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};
