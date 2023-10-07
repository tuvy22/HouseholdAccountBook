"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import {
  Spinner,
  Input,
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";

interface IFormInput {
  id: string;
  password: string;
}

const Login = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
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
      const response = await axios.post(`/auth`, { userId, password });
      setError("");

      router.push("/expense");
    } catch (error) {
      setError("IDまたはパスワードが間違っています。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-[20rem]">
        <Typography variant="h2" className="text-center pt-5 text-xl">
          ログイン
        </Typography>
        <CardBody>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <Input
              label="ユーザID"
              type="text"
              variant="standard"
              size="lg"
              crossOrigin={undefined}
              icon={<i className="fas fa-heart" />}
              {...register("id")}
            />

            <Input
              label="パスワード"
              type="password"
              variant="standard"
              size="lg"
              crossOrigin={undefined}
              icon={<i className="fas fa-heart" />}
              {...register("password")}
            />

            <Button
              type="submit"
              variant="filled"
              color="green"
              size="lg"
              className="mt-6 w-full"
            >
              {loading ? <Spinner className="m-auto" /> : <>ログイン</>}
            </Button>
          </form>
          {error && (
            <div className="text-red-500 text-center mt-4">{error}</div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Login;
