"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@material-tailwind/react";
import { useForm } from "react-hook-form";

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
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl mb-6 text-center">ログイン</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="ユーザID"
            className="mb-4 w-full px-3 py-2 border rounded"
            {...register("id")}
          />
          <input
            type="password"
            placeholder="パスワード"
            className="mb-4 w-full px-3 py-2 border rounded"
            {...register("password")}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="filled"
              color="green"
              size="md"
              className="mt-4 w-full md:w-auto"
            >
              ログイン
            </Button>
          </div>
        </form>
        {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      </div>
    </div>
  );
};

export default Login;
