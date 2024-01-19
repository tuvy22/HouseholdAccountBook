"use client";

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
import { MdHeaderMenu } from "./MdHeaderMenu";
import { authDel } from "../util/apiClient";
import Logo from "./Logo";

const Header = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogout = async (e: React.FormEvent) => {
    try {
      await authDel();
      router.push("/login");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 flex items-center justify-between px-4 bg-gray-800 text-white">
      <div className="flex-1 flex justify-between w-full">
        <Link href="/income-and-expense">
          <Logo />
        </Link>
      </div>
      <nav className="hidden md:flex flex-[2] items-center justify-between">
        <Link
          href="/income-and-expense"
          className="py-5 flex-1 flex justify-center items-center gap-3 text-center cursor-pointer hover:bg-blue-gray-600"
        >
          <MenuBookIcon />
          <Typography variant="h2" className="text-xl">
            入力
          </Typography>
        </Link>
        <Link
          href="/liquidation/search"
          className="py-5 flex-1 flex justify-center items-center gap-3 text-center cursor-pointer hover:bg-blue-gray-600"
        >
          <AccountBalanceWalletIcon />
          <Typography variant="h2" className="text-xl">
            清算
          </Typography>
        </Link>
        <Link
          href="/dashboard"
          className="py-5 flex-1 flex justify-center items-center gap-3 text-center cursor-pointer hover:bg-blue-gray-600"
        >
          <LineAxisIcon />
          <Typography variant="h2" className="text-xl">
            ダッシュボード
          </Typography>
        </Link>

        <Link
          href="/setting"
          className="py-5 flex-1 flex justify-center items-center gap-3 text-center cursor-pointer hover:bg-blue-gray-600"
        >
          <BuildIcon />
          <Typography variant="h2" className="text-xl">
            設定
          </Typography>
        </Link>
      </nav>
      <div className="hidden md:flex flex-1 items-center  gap-3 justify-end">
        <HeaderUser />
        <LogoutIcon
          onClick={handleLogout}
          className="cursor-pointer hover:text-green-500"
          fontSize="large"
        />
      </div>
      <div className="flex md:hidden  justify-center items-center">
        <MdHeaderMenu handleLogout={handleLogout} />
      </div>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </header>
  );
};

export default Header;
