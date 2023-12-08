"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Card,
  CardBody,
  Typography,
  Button,
} from "../../materialTailwindExports";
import { putInviteToken } from "@/app/util/apiClient";

import { useState } from "react";

const UserInvite = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [error, setError] = useState("");

  const onSubmitLogin = async () => {
    try {
      await putInviteToken(token ? token : "");
      router.push("/login");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };
  const onSubmitRegister = async () => {
    try {
      await putInviteToken(token ? token : "");
      router.push("/user-register");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  return (
    <>
      <Card className="p-10 flex items-center justify-center">
        <Typography variant="h2" className="pt-5 text-xl" color="blue-gray">
          グループへの加入
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          以下からログインまたは、ユーザー作成をお願いします。
        </Typography>
        <CardBody className="flex flex-col md:flex-row gap-3">
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
            アカウントをお持ちではない方は
            <br />
            こちら
          </Button>
        </CardBody>
        {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      </Card>
    </>
  );
};

export default UserInvite;
