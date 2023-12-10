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
import { addError, addSuccess, useAlert } from "@/app/context/AlertProvider";
import { AlertValue } from "@/app/components/AlertCustoms";
import SubmitButtonForm from "@/app/components/SubmitButtonForm";

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
    try {
      await updateUser(user.user);
      //結果アラート
      addSuccess("更新が成功しました。", alert);
    } catch (error) {
      if (error instanceof Error) {
        addError(error.message, alert);
      }
    }
  };
  return (
    <form
      onSubmit={(e) => handleSubmit((data) => onSubmit(data))(e)}
      className="w-full max-w-sm mx-auto"
    >
      <NameForm errors={errors} updateRegister={register} />

      <SubmitButtonForm buttonName={"更新"} buttonColor={"green"} />
    </form>
  );
}
