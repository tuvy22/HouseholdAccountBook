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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "@/app/context/UserProvider";
import {
  UserUpdateSchema,
  userUpdateSchema,
} from "@/app/components/UserSchema";
import NameForm from "@/app/components/NameForm";

export function User() {
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserUpdateSchema>({
    resolver: zodResolver(userUpdateSchema),
  });

  return (
    <Card className="p-10 flex items-center justify-center">
      <Typography variant="h4" color="blue-gray">
        ニックネーム変更
      </Typography>
      <CardBody>
        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
          <div className="mb-1 flex flex-col gap-6">
            <NameForm errors={errors} updateRegister={register} />
          </div>
          <Button
            type="submit"
            variant="filled"
            color="green"
            size="lg"
            className="mt-6"
            fullWidth
          >
            更新
          </Button>
        </form>
        {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      </CardBody>
    </Card>
  );
}
