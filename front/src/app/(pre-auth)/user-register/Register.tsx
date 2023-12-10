"use client";

import {
  Button,
  Card,
  CardBody,
  Input,
  Typography,
} from "@/app/materialTailwindExports";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserCreate } from "../../util/types";
import { useRouter } from "next/navigation";
import { deleteInviteToken, postUser } from "../../util/apiClient";
import { useState } from "react";
import NameForm from "../../components/NameForm";
import {
  UserCreateSchema,
  userCreateSchema,
} from "../../components/UserSchema";
import { IncomeAndExpenseConfirmDialog } from "@/app/components/IncomeAndExpenseConfirmDialog";

export const Register = ({ isInvite }: { isInvite: boolean }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<UserCreateSchema>({
    resolver: zodResolver(userCreateSchema),
  });

  const handleOk = () => {
    submit(getValues().id, getValues().password, getValues().name);
  };

  const handleCancel = async () => {
    try {
      await deleteInviteToken();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
    submit(getValues().id, getValues().password, getValues().name);
  };

  const onSubmit = (data: UserCreateSchema) => {
    if (isInvite) {
      setOpenDialog(true);
      return;
    }
    submit(data.id, data.password, data.name);
  };

  const submit = async (id: string, password: string, name: string) => {
    const user: UserCreate = {
      id: id,
      password: password,
      name: name,
    };

    try {
      await postUser(user);
      router.push("/income-and-expense");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  return (
    <>
      <Link
        href="/login"
        scroll={false}
        className="fixed top-20 md:top-2 right-1 md:right-4 z-50"
      >
        <Button
          type="submit"
          variant="outlined"
          color="green"
          size="lg"
          className="rounded-full"
        >
          アカウントをお持ちの方はこちら
        </Button>
      </Link>
      <Card className="max-w-sm w-full">
        <CardBody>
          <Typography
            variant="h2"
            className="pt-5 text-xl text-center md:text-left"
          >
            アカウント作成
          </Typography>
          <Typography className="mt-1">
            利用を開始するためには以下の情報を入力してください
          </Typography>
          <form
            onSubmit={(e) => handleSubmit((data) => onSubmit(data))(e)}
            className="mt-8 mb-2"
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <NameForm errors={errors} createRegister={register} />
              <Input
                label="ユーザID"
                type="text"
                variant="outlined"
                size="lg"
                crossOrigin={undefined}
                {...register("id")}
              />
              {errors.id && (
                <div className="text-red-500">{errors.id.message}</div>
              )}
              <Input
                label="パスワード"
                type="password"
                variant="outlined"
                size="lg"
                crossOrigin={undefined}
                {...register("password")}
              />
              {errors.password && (
                <div className="text-red-500">{errors.password.message}</div>
              )}

              <Input
                label="パスワード（確認）"
                type="password"
                variant="outlined"
                size="lg"
                crossOrigin={undefined}
                {...register("passwordConfirmation")}
              />
              {errors.passwordConfirmation && (
                <div className="text-red-500 max-w">
                  {errors.passwordConfirmation.message}
                </div>
              )}
            </div>
            <Button
              type="submit"
              variant="filled"
              color="green"
              size="lg"
              className="w-full mt-8"
            >
              作成
            </Button>
          </form>
          {error && (
            <div className="text-red-500 text-center mt-4">{error}</div>
          )}
        </CardBody>
      </Card>
      <IncomeAndExpenseConfirmDialog
        open={openDialog}
        handleOpen={() => setOpenDialog(!openDialog)}
        handleCancel={handleCancel}
        handleOk={handleOk}
        title="グループへの加入"
        message="招待されたグループに加入してよろしいですか？"
        cancelBtnName="加入しない"
        okBtnName="加入する"
        isOkBtnFocus={true}
      />
    </>
  );
};
