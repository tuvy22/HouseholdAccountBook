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
import Link from "next/link";
import { IncomeAndExpenseConfirmDialog } from "@/app/components/IncomeAndExpenseConfirmDialog";
import { addError, useAlert } from "@/app/context/AlertProvider";

interface IFormInput {
  id: string;
  password: string;
}

const Login = ({ isInvite }: { isInvite: boolean }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<IFormInput>();

  const handleOk = () => {
    submit(getValues().id, getValues().password);
  };

  const handleCancel = async () => {
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
      <Link href="/user-register" className="fixed top-4 right-4">
        <Button
          type="submit"
          variant="outlined"
          color="green"
          size="lg"
          className="rounded-full"
        >
          アカウントをお持ちではない方はこちら
        </Button>
      </Link>

      <Card className="p-5 flex items-center justify-center max-w-lg">
        <Typography variant="h2" className="pt-5 text-xl">
          ログイン
        </Typography>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 mb-2 md:w-96">
            <div className="grid grid-cols-[auto_1fr_auto] grid-rows[auto_auto_10px_auto_auto] items-center gap-4">
              <AccountBoxIcon />
              <Input
                label="ユーザID"
                type="text"
                variant="standard"
                size="lg"
                crossOrigin={undefined}
                {...register("id")}
              />
              <div></div>
              <LockIcon />
              <Input
                label="パスワード"
                type={showPassword ? "text" : "password"}
                variant="standard"
                size="lg"
                crossOrigin={undefined}
                {...register("password")}
              />
              <div className="text-xs text-gray-500 cursor-pointer hover:text-green-500">
                {showPassword ? (
                  <VisibilityIcon onClick={toggleShowPassword} />
                ) : (
                  <VisibilityOffIcon onClick={toggleShowPassword} />
                )}
              </div>
              <div className="col-span-3"></div>
              <Button
                type="submit"
                variant="filled"
                color="green"
                size="lg"
                className="col-span-3"
              >
                {loading ? <Spinner className="m-auto" /> : <>ログイン</>}
              </Button>
            </div>
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
        cancelBtnName="加入しないでログイン"
        okBtnName="加入してログイン"
        isOkBtnFocus={true}
      />
    </>
  );
};

export default Login;
