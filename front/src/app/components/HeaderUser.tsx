"use client";

import Link from "next/link";
import { useUser } from "../context/UserProvider";
import { Spinner, Typography } from "../materialTailwindExports";
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
    <div className="">
      こんにちは&nbsp;
      {user.user.name !== null ? (
        <Link href={`/setting?open=${SETTING_OPEN.USER_NAME_Update}`}>
          <Typography variant="lead" className="font-semibold inline-block">
            {user.user.name}
          </Typography>
        </Link>
      ) : (
        <Spinner className="inline-block" />
      )}
      さん
    </div>
  );
};

export default HeaderUser;
