"use client";

import Link from "next/link";
import { useUser } from "../context/UserProvider";
import { Spinner } from "../materialTailwindExports";
import { SETTING_OPEN } from "../(auth)/setting/Setting";
import { useEffect } from "react";
import { getLoginUser } from "../util/apiClient";

const HeaderUser = () => {
  const user = useUser();

  // useEffect(() => {
  //   const fetchDataFromServer = async () => {
  //     user.setUser(await getLoginUser());
  //   };
  //   fetchDataFromServer();
  // }, []);

  return (
    <span className="mr-4">
      こんにちは&nbsp;
      {user.user.name !== null ? (
        <Link href={`/setting?open=${SETTING_OPEN.USER_NAME}`}>
          <span className="text-lg font-semibold">{user.user.name}</span>
        </Link>
      ) : (
        <Spinner className="inline-block" />
      )}
      さん
    </span>
  );
};

export default HeaderUser;
