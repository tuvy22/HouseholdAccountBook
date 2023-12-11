"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Card,
  CardBody,
  Typography,
  Button,
} from "../../materialTailwindExports";
import { postInviteToken } from "@/app/util/apiClient";

import { useState } from "react";

const UserInvite = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [error, setError] = useState("");

  const onSubmitLogin = async () => {
    try {
      await postInviteToken(token ? token : "");
      router.push("/login", { scroll: false });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };
  const onSubmitRegister = async () => {
    try {
      await postInviteToken(token ? token : "");
      router.push("/user-register", { scroll: false });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  return (
    <>
      <Card className="max-w-3xl w-full">
        <CardBody>
          <Typography
            variant="h2"
            className="pt-5 text-xl text-center md:text-left"
          >
            グループへの加入
          </Typography>
          <Typography className="mt-1">
            以下からログインまたは、ユーザー作成をお願いします。
          </Typography>
          <div className="mt-8 mb-2 flex flex-col md:flex-row gap-3">
            <Button
              onClick={() => onSubmitLogin()}
              type="submit"
              variant="outlined"
              color="green"
              size="lg"
              className="rounded-full flex-1"
            >
              アカウントをお持ちの方はこちら
            </Button>
            <Button
              onClick={() => onSubmitRegister()}
              type="submit"
              variant="outlined"
              color="green"
              size="lg"
              className="rounded-full flex-1"
            >
              アカウントをお持ちではない方はこちら
            </Button>
          </div>
        </CardBody>
        {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      </Card>
    </>
  );
};

export default UserInvite;
