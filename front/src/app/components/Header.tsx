"use client";

import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Typography } from "../materialTailwindExports";
import Link from "next/link";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LogoutIcon from "@mui/icons-material/Logout";
import HeaderUser from "./HeaderUser";
import BuildIcon from "@mui/icons-material/Build";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LineAxisIcon from "@mui/icons-material/LineAxis";

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
      <div className="flex-1 flex">
        <Link
          href="/income-and-expense"
          className="p-1 flex flex-col items-left"
        >
          <span className="text-xs">家計簿サービス</span>
          <Typography variant="h2" className="font-bold text-3xl mx-5">
            えふSaku
          </Typography>
        </Link>
      </div>
      <div className="flex-[2] flex items-center justify-between">
        <Link
          href="/income-and-expense"
          className="py-5 flex-1 flex justify-center gap-3 text-center cursor-pointer hover:bg-blue-gray-600"
        >
          <MenuBookIcon />
          <Typography variant="h3" className="text-xl">
            入力
          </Typography>
        </Link>
        <Link
          href="/liquidation"
          className="py-5 flex-1 flex justify-center gap-3 text-center cursor-pointer hover:bg-blue-gray-600"
        >
          <AccountBalanceWalletIcon />
          <Typography variant="h3" className="text-xl">
            清算
          </Typography>
        </Link>
        <Link
          href="/dashboard"
          className="py-5 flex-1 flex justify-center gap-3 text-center cursor-pointer hover:bg-blue-gray-600"
        >
          <LineAxisIcon />
          <Typography variant="h3" className="text-xl">
            ダッシュボード
          </Typography>
        </Link>

        <Link
          href="/setting"
          className="py-5 flex-1 flex justify-center gap-3 text-center cursor-pointer hover:bg-blue-gray-600"
        >
          <BuildIcon />
          <Typography variant="h3" className="text-xl">
            設定
          </Typography>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-end gap-3">
        <HeaderUser />
        <LogoutIcon
          onClick={handleLogout}
          className="cursor-pointer hover:text-green-500 text-3xl"
        />
      </div>

      {error && <div className="text-red-500 mt-2">{error}</div>}
    </header>
  );
};

export default Header;
