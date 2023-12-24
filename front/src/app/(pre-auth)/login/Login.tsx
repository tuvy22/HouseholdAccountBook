"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Spinner,
  Input,
  Card,
  CardBody,
  Typography,
  Button,
} from "../../materialTailwindExports";

import LockIcon from "@mui/icons-material/Lock";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { auth, deleteInviteToken } from "../../util/apiClient";
import { ConfirmDialog } from "@/app/components/ConfirmDialog";

interface IFormInput {
  id: string;
  password: string;
}

export function Login({ isInvite }: { isInvite: boolean }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const router = useRouter();

  const { register, handleSubmit, getValues } = useForm<IFormInput>();

  const handleOk = () => {
    submit(getValues().id, getValues().password);
  };

  const handleInviteCancel = async () => {
    try {
      await deleteInviteToken();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
    submit(getValues().id, getValues().password);
  };

  const onSubmit = (data: IFormInput) => {
    if (isInvite) {
      setOpenDialog(true);
      return;
    }
    submit(data.id, data.password);
  };
  const submit = async (userId: string, password: string) => {
    setLoading(true);
    try {
      await auth(userId, password);
      router.push("/income-and-expense");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Card className="max-w-sm w-full m-2">
        <CardBody>
          <Typography variant="h2" className="pt-5 text-xl text-center">
            ログイン
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 mb-2">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-full items-center flex gap-3">
                <AccountBoxIcon />
                <Input
                  label="ユーザID"
                  type="text"
                  variant="standard"
                  size="lg"
                  crossOrigin={undefined}
                  {...register("id")}
                />
              </div>

              <div className="relative w-full items-center flex gap-3">
                <LockIcon />
                <Input
                  label="パスワード"
                  type={showPassword ? "text" : "password"}
                  variant="standard"
                  size="lg"
                  crossOrigin={undefined}
                  className="pr-10"
                  {...register("password")}
                />
                <div className="absolute top-3 right-2 text-gray-500 cursor-pointer hover:text-green-500">
                  {showPassword ? (
                    <VisibilityIcon onClick={toggleShowPassword} />
                  ) : (
                    <VisibilityOffIcon onClick={toggleShowPassword} />
                  )}
                </div>
              </div>
            </div>
            <Button
              type="submit"
              variant="filled"
              color="green"
              size="lg"
              className="w-full mt-8"
            >
              {loading ? <Spinner className="m-auto" /> : <>ログイン</>}
            </Button>
          </form>
          {error && (
            <div className="text-red-500 text-center mt-4">{error}</div>
          )}
        </CardBody>
      </Card>
      <ConfirmDialog
        open={openDialog}
        handleOpen={() => setOpenDialog(!openDialog)}
        handleCancel={handleInviteCancel}
        handleOk={handleOk}
        title="グループへの加入"
        message="招待されたグループに加入してよろしいですか？"
        cancelBtnName="加入しないでログイン"
        okBtnName="加入してログイン"
        isOkBtnFocus={true}
      />
    </>
  );
}
