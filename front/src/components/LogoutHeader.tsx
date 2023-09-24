"use client"

import axios from 'axios';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const LogoutHeader = () => {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogout = async (e: React.FormEvent) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth-del`);
            if (response.status === 200) {
                router.push("/login");
            } else {
                setError('ログアウトに失敗しました。');
            }
        } catch (error) {
            setError('ログアウト時にエラーが発生しました。');
            console.log(error);
        }
    };

    return (
        <div className="flex justify-end p-4 bg-gray-800 text-white">
            <div><button onClick={handleLogout} className="hover:underline px-4">ログアウト</button></div>
            {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
    );
};

export default LogoutHeader;
