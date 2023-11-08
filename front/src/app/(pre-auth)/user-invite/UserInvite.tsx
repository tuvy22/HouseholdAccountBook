"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Card,
  CardBody,
  Typography,
  Button,
} from "../../materialTailwindExports";
import Link from "next/link";
import { putInviteToken } from "@/app/util/api";

const UserInvite = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const onSubmitLogin = async () => {
    putInviteToken(token ? token : "");
    router.push("/login");
  };
  const onSubmitRegister = async () => {
    putInviteToken(token ? token : "");
    router.push("/user-register");
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
        <CardBody className="flex flex-col gap-10">
          <div className="flex gap-3">
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
          </div>
          <div>
            <Link href="/" className="col-span-2 flex justify-end">
              <Button
                type="submit"
                variant="outlined"
                color="gray"
                size="lg"
                className="rounded-full"
              >
                グループへは加入しない
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default UserInvite;
