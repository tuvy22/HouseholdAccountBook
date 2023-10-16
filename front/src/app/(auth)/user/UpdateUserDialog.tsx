"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  Input,
  Option,
  DialogFooter,
  DialogHeader,
  DialogBody,
  Select,
} from "@material-tailwind/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/app/util/types";
import { Schema } from "./schema";

type Props = {
  open: boolean;
  handleOpen: () => void;
  updatedUser: User;
  handleUpdate: (user: User) => void;
};

export const UpdateUserDialog: React.FC<Props> = ({
  open,
  handleOpen,
  updatedUser,

  handleUpdate,
}) => {
  interface IFormInput {
    id: string;
    password: string;
    name: string;
  }
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>();

  useEffect(() => {
    if (open) {
      reset({
        id: updatedUser.id,
        name: updatedUser.name,
      });
    }
  }, [open, reset, updatedUser.id, updatedUser.name]);

  const onSubmit = (data: Schema) => {
    const newUser: User = {
      id: data.id,
      name: data.name,
      groupId: 0,
    };
    handleUpdate(newUser);
    handleOpen();
  };

  return (
    <>
      <Dialog open={open} handler={handleOpen}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>更新内容入力</DialogHeader>
          <DialogBody className="flex flex-col flex-wrap justify-between gap-3 md:flex-row">
            <div className="flex flex-col flex-grow">
              <Input
                label="ユーザID"
                type="text"
                variant="standard"
                size="lg"
                crossOrigin={undefined}
                icon={<i className="fas fa-user" />}
                {...register("id")}
              />

              <Input
                label="名前"
                type="text"
                variant="standard"
                size="lg"
                crossOrigin={undefined}
                icon={<i className="fas fa-address-card" />}
                {...register("name")}
              />
            </div>
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
            <Button variant="gradient" color="green" type="submit">
              更新
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
};
