"use client";
import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import {
  Spinner,
  Input,
  Card,
  CardBody,
  Typography,
  Button,
} from "@/app/materialTailwindExports";
import { addSuccess, useAlert } from "@/app/context/AlertProvider";

interface IFormInput {
  id: string;
  password: string;
  name: string;
}

const Register = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const alert = useAlert();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit = async (data: IFormInput) => {
    let id: string = data.id;
    let password: string = data.password;
    let name: string = data.name;
    setLoading(true);

    try {
      await axios.post(`/api/private/user/register`, {
        id,
        password,
        name,
      });

      //結果追加
      addSuccess("登録が成功しました。", alert);

      setError("");
    } catch (error) {
      setError("ユーザーの登録に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full max-w-[20rem]">
        <Typography variant="h2" className="text-center pt-5 text-xl">
          ユーザー登録
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
              icon={<i className="fas fa-user" />}
              {...register("id")}
            />

            <Input
              label="パスワード"
              type="password"
              variant="standard"
              size="lg"
              crossOrigin={undefined}
              icon={<i className="fas fa-lock" />}
              {...register("password")}
            />

            <Input
              label="名前"
              type="text"
              variant="standard"
              size="lg"
              crossOrigin={undefined}
              icon={<i className="fas fa-address-card" />}
              {...register("name")}
            />

            <Button
              type="submit"
              variant="filled"
              color="blue"
              size="lg"
              className="mt-6 w-full"
            >
              {loading ? <Spinner className="m-auto" /> : <>登録</>}
            </Button>
          </form>
          {error && (
            <div className="text-red-500 text-center mt-4">{error}</div>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default Register;
