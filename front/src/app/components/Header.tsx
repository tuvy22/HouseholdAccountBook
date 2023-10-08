"use client";

import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Typography } from "@material-tailwind/react";

const Header = ({ userId }: { userId: string }) => {
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
    <div className="sticky top-0 left-0 right-0 z-50 flex items-center justify-between px-4 bg-gray-800 text-white h-14">
      <Typography variant="h2" className="text-2xl font-bold">
        家計簿Web
      </Typography>
      <div className="flex items-center h-full">
        <span className="mr-4">
          こんにちは&nbsp;
          <span className="text-lg font-semibold">{userId}</span>
          さん
        </span>
        <button
          onClick={handleLogout}
          className="px-4 h-full hover:underline hover:bg-gray-700"
        >
          ログアウト
        </button>
      </div>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
};

export default Header;
