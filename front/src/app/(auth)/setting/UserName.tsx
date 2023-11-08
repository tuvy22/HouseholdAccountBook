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
import { updateUserName } from "@/app/util/api";
import { useUser } from "@/app/context/UserProvider";
import { User, UserName } from "@/app/util/types";
import { useAlert } from "@/app/context/AlertProvider";
import { AlertValue } from "@/app/components/AlertCustoms";

export function UserName() {
  const [error, setError] = useState("");
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
    const userNamePut: UserName = {
      name: data.name,
    };
    try {
      await updateUserName(userNamePut);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
    //コンテキストの情報を置き換え
    const newUser: User = {
      id: user.user.id,
      name: userNamePut.name,
      groupId: user.user.groupId,
    };
    user.setUser(newUser);

    //結果アラート
    const newAlertValue: AlertValue = {
      color: "green",
      value: "更新が成功しました。",
    };
    alert.setAlertValues([...alert.alertValues, newAlertValue]);
  };
  return (
    <Card className="p-10 flex items-center justify-center">
      <Typography variant="h4" color="blue-gray">
        ニックネーム変更
      </Typography>
      <CardBody>
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
        {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      </CardBody>
    </Card>
  );
}
