"use client";

import { useSearchParams } from "next/navigation";

import {
  Card,
  CardBody,
  Typography,
  Button,
} from "../../materialTailwindExports";
import Link from "next/link";
import { useEffect } from "react";

const UserInvite = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    // fetchUserInviteUrl();
  }, []);

  return (
    <>
      <Card className="p-10 flex items-center justify-center">
        <Typography variant="h2" className="pt-5 text-xl" color="blue-gray">
          グループへの加入
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          以下からログインまたは、ユーザー作成をお願いします。
        </Typography>
        <CardBody className="flex gap-3">
          <Link href="/login">
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
          <Link href="/user-register">
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
        </CardBody>
      </Card>
    </>
  );
};

export default UserInvite;
