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
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { useUser } from "@/app/context/UserProvider";

interface IFormInput {
  id: string;
  password: string;
}

const Login = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
      const response = await axios.post(`/api/public/auth`, {
        userId,
        password,
      });

      setError("");
      console.log(`ログイン時にセットしたID${response.data.id}`);
      setUser(response.data);

      router.push("/expense");
    } catch (error) {
      setError("IDまたはパスワードが間違っています。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-[20rem]">
      <Typography variant="h2" className="text-center pt-5 text-xl">
        ログイン
      </Typography>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
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
        {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      </CardBody>
    </Card>
  );
};

export default Login;
