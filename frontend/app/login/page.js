// pages/login.js
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/components/context';
import Link from 'next/link';

const LoginPage = () => {
  const router = useRouter();
  const { login } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://produpbackend.vercel.app/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      setError('');
      login(username);
      router.push('/trial');

    } catch (error) {
      setError('Invalid username or password');
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-900 min-h-screen text-white">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-200 mb-8">Login to ProdUp</h1>
        <form className="bg-gray-800 p-8 rounded-lg shadow-lg text-left" onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out"
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out"
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="mb-4 text-red-500">{error}</div>}
          <div className="flex items-center justify-between">
            <button
              className="px-6 py-3 bg-blue-600 text-white text-lg rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out"
              type="submit"
            >
              Login
            </button>
            <Link href="/register">
              <p className="cursor-pointer px-6 py-3 bg-green-600 text-white text-lg rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300 ease-in-out">
                Register
              </p>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
