"use client";

import {
  Button,
  Card,
  CardBody,
  Typography,
} from "@/app/materialTailwindExports";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  UserUpdateSchema,
  userUpdateSchema,
} from "@/app/components/UserSchema";
import NameForm from "@/app/components/NameForm";
import { updateUser } from "@/app/util/apiClient";
import { useUser } from "@/app/context/UserProvider";
import { useAlert } from "@/app/context/AlertProvider";
import { AlertValue } from "@/app/components/AlertCustoms";

export function UserName() {
  const user = useUser();
  const alert = useAlert();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserUpdateSchema>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      name: user.user?.name ?? "",
    },
  });
  const onSubmit = async (data: UserUpdateSchema) => {
    user.user.name = data.name;
    await updateUser(user.user);

    //結果アラート
    const newAlertValue: AlertValue = {
      color: "green",
      value: "更新が成功しました。",
    };
    alert.setAlertValues([...alert.alertValues, newAlertValue]);
  };
  return (
    <form
      className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
      onSubmit={(e) => handleSubmit((data) => onSubmit(data))(e)}
    >
      <div className="mb-1 flex flex-col gap-6">
        <NameForm errors={errors} updateRegister={register} />
      </div>
      <Button
        type="submit"
        variant="filled"
        color="green"
        size="lg"
        className="mt-6"
        fullWidth
      >
        更新
      </Button>
    </form>
  );
}
