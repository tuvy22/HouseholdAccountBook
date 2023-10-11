"use client";

import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Typography } from "@material-tailwind/react";
import { useUser } from "../context/UserProvider";
import Link from "next/link";
import LogoutIcon from "@mui/icons-material/Logout";

const Header = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const user = useUser().user;

  const handleLogout = async (e: React.FormEvent) => {
    try {
      const response = await axios.post(`/api/private/auth-del`);
      if (response.status === 200) {
        router.push("/login");
      } else {
        setError("ログアウトに失敗しました。");
      }
    } catch (error) {
      setError("ログアウト時にエラーが発生しました。");
    }
  };

  return (
    <div className="sticky top-0 left-0 right-0 z-50 flex items-center justify-between px-4 bg-gray-800 text-white h-14">
      <Typography variant="h2" className="text-2xl font-bold">
        <Link href="/login">家計簿Web</Link>
      </Typography>
      <div className="flex items-center h-full gap-3">
        <span className="mr-4">
          こんにちは&nbsp;
          <span className="text-lg font-semibold">{user.id}</span>
          さん
        </span>
        <LogoutIcon
          onClick={handleLogout}
          className="cursor-pointer hover:text-green-500 text-2xl"
        />
      </div>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
};

export default Header;
