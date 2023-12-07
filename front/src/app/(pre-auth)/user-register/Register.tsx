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
import { addError } from "@/app/context/AlertProvider";

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
      <Link href="/login" className="fixed top-4 right-4">
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
      <Card className="p-5 flex items-center justify-center max-w-lg">
        <Typography variant="h2" className="pt-5 text-xl" color="blue-gray">
          アカウント作成
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          利用を開始するためには以下の情報を入力してください
        </Typography>
        <CardBody>
          <form
            onSubmit={(e) => handleSubmit((data) => onSubmit(data))(e)}
            className="mt-8 mb-2 md:w-96"
          >
            <div className="mb-1 flex flex-col gap-6">
              <NameForm errors={errors} createRegister={register} />
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                ユーザーID
              </Typography>
              <Input
                type="text"
                size="lg"
                crossOrigin={undefined}
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                {...register("id")}
              />
              {errors.id && (
                <div className="text-red-500">{errors.id.message}</div>
              )}
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                パスワード
              </Typography>
              <Input
                type="password"
                size="lg"
                crossOrigin={undefined}
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                {...register("password")}
              />
              {errors.password && (
                <div className="text-red-500">{errors.password.message}</div>
              )}
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                パスワード（確認）
              </Typography>
              <Input
                type="password"
                size="lg"
                crossOrigin={undefined}
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
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
              className="mt-6"
              fullWidth
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
