// pages/trial.js
"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/components/context';

const TrialPage = () => {
  const router = useRouter();
  const { user, logout } = useUser();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) return null; // or a loading spinner

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-200 mb-8">Welcome, {user.username}</h1>
        <button
          className="px-6 py-3 bg-red-600 text-white text-lg rounded-lg shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-300 ease-in-out"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default TrialPage;
