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
import { Schema, schema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "../util/types";
import { useRouter } from "next/navigation";
import { auth, postUser } from "../util/api";
import { useState } from "react";
import { useUser } from "../context/UserProvider";

export function Register() {
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Schema) => {
    const user: User = {
      id: data.id,
      password: data.password,
      name: data.name,
      groupId: 0,
    };

    try {
      await postUser(user);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
    try {
      setUser(await auth(user.id, user.password));
      router.push("/income-and-expense/list");
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
      <Card className="p-10">
        <Typography variant="h4" color="blue-gray">
          アカウント作成
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          利用を開始するためには以下の情報を入力してください
        </Typography>
        <CardBody>
          <form
            onSubmit={(e) => handleSubmit((data) => onSubmit(data))(e)}
            className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
          >
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                ニックネーム
              </Typography>
              <Input
                type="text"
                size="lg"
                crossOrigin={undefined}
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                {...register("name")}
              />
              {errors.name && (
                <div className="text-red-500">{errors.name.message}</div>
              )}
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
                <div className="text-red-500">
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
    </>
  );
}
