"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/auth`, { userId, password });
      setError('');
      router.push("/expense");
    } catch (error) {
      setError('IDまたはパスワードが間違っています。');
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin}>
            <input
                type="text"
                placeholder="ユーザID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="mb-4 w-full px-3 py-2 border rounded"
            />
            <input
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-4 w-full px-3 py-2 border rounded"
            />
            <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">
                Login
            </button>
        </form>
        {error && <div className="text-red-500 text-center mt-4">{error}</div>}
    </div>
</div>

  );
};

export default Login;
