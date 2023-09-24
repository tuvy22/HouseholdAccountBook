"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProtectedPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  return (
    <div>protected
      {message && <p>{message}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default ProtectedPage;
