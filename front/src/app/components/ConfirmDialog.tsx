"use client";

import React, { useEffect, useRef } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "../materialTailwindExports";
import { useForm } from "react-hook-form";

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

export const ConfirmDialog: React.FC<Props> = ({
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
      <Dialog open={open} handler={handleOpen} size={"xs"}>
        <DialogHeader>{title}</DialogHeader>
        <DialogBody divider>{message}</DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            ref={cancelButtonRef}
            onClick={() => {
              handleCancel();
              handleOpen();
            }}
            className="mr-1"
          >
            {cancelBtnName}
          </Button>
          <Button
            variant="gradient"
            color="green"
            ref={okButtonRef}
            onClick={() => {
              handleOk();
              handleOpen();
            }}
          >
            {okBtnName}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};
