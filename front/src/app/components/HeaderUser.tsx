"use client";

import { useEffect, useState } from "react";
import { useUser } from "../context/UserProvider";
import { Spinner } from "../materialTailwindExports";
import { User } from "../util/types";

const HeaderUser = () => {
  const user = useUser().user;

  return (
    <span className="mr-4">
      こんにちは&nbsp;
      {user.name !== null ? (
        <span className="text-lg font-semibold">{user.name}</span>
      ) : (
        <Spinner className="inline-block" />
      )}
      さん
    </span>
  );
};

export default HeaderUser;
