"use client";

import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Typography } from "@material-tailwind/react";

const LogoutHeader = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogout = async (e: React.FormEvent) => {
    try {
      const response = await axios.post(`/auth-del`);
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
    <div className="flex justify-between p-4 bg-gray-800 text-white">
      <Typography variant="h2" className="text-2xl font-bold">
        家計簿一覧
      </Typography>
      <div>
        <button onClick={handleLogout} className="hover:underline px-4">
          ログアウト
        </button>
      </div>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
};

export default LogoutHeader;
