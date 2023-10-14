"use client";

import { useUser } from "../context/UserProvider";
import { Spinner } from "@material-tailwind/react";

const HeaderUser = () => {
  const user = useUser().user;

  return (
    <span className="mr-4">
      こんにちは&nbsp;
      {user.id !== null ? (
        <span className="text-lg font-semibold">{user.id}</span>
      ) : (
        <Spinner className="inline-block" />
      )}
      さん
    </span>
  );
};

export default HeaderUser;