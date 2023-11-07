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
import { useUser } from "@/app/context/UserProvider";
import LockIcon from "@mui/icons-material/Lock";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { auth } from "../../util/api";
import Link from "next/link";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

interface IFormInput {
  id: string;
  password: string;
}

const Login = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const router = useRouter();
  const { setUser } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit = async (data: IFormInput) => {
    let userId: string = data.id;
    let password: string = data.password;

    setLoading(true);
    try {
      setUser(await auth(userId, password));
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
        {/* <Button
          type="submit"
          variant="outlined"
          color="green"
          size="lg"
          className="group relative rounded-full flex items-center overflow-hidden pr-[72px]"
        >
          アカウントをお持ちではない方はこちら
          <span className="absolute right-0 grid h-full w-12 place-items-center bg-green-500">
            <AssignmentIndIcon className="text-white" />
          </span>
        </Button> */}
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

      <Card className="p-10 flex items-center justify-center">
        <Typography variant="h2" className="pt-5 text-xl">
          ログイン
        </Typography>
        <CardBody>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
          >
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
    </>
  );
};

export default Login;
