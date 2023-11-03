"use client";

import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Typography } from "../materialTailwindExports";
import Link from "next/link";
import LogoutIcon from "@mui/icons-material/Logout";
import HeaderUser from "./HeaderUser";

const Header = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
    <header className="sticky top-0 left-0 right-0 z-50 flex items-center justify-between px-4 bg-gray-800 text-white">
      <div className="flex gap-16">
        <Link
          href="/income-and-expense/list"
          className="p-1 flex flex-col items-left"
        >
          <span className="text-xs">家計簿サービス</span>
          <Typography variant="h2" className="font-bold text-3xl">
            えふSaku
          </Typography>
        </Link>
        <Link
          href="/income-and-expense/dashboard"
          className="p-1 flex items-center cursor-pointer hover:bg-blue-gray-600"
        >
          <Typography variant="h3" className="text-xl">
            ダッシュボード
          </Typography>
        </Link>
      </div>
      <div className="flex items-center h-full gap-3">
        <HeaderUser />
        <LogoutIcon
          onClick={handleLogout}
          className="cursor-pointer hover:text-green-500 text-2xl"
        />
      </div>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </header>
  );
};

export default Header;
