"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProtectedPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProtected = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/check-token`, { withCredentials: true });
        setMessage(response.data.message);
      } catch (err) {
        setError('Error accessing protected route');
      }
    };
    fetchProtected();
  }, []);

  return (
    <div>
      {message && <p>{message}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default ProtectedPage;
