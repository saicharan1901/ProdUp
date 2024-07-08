"use client"
import React, { useState, useEffect } from 'react';
import { onAuthStateChangedListener } from '@/app/firebase';

const HomeDiv = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  console.log(user)

  return (
    <div className="flex items-center justify-center bg-gray-900 min-h-screen text-white">
      
      {user ? 
      <div className="text-center">
      <h1 className="text-6xl font-extrabold animate-bounce text-gray-200 mb-4">
        Welcome to ProdUp
      </h1>
      <p className="text-xl text-gray-600 mb-8 animate-pulse">
        Boost your productivity by scheduling tasks, setting reminders, and more!
      </p>
      <button
        className="px-8 py-4 bg-blue-600 text-white text-lg rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Get Started
      </button>
    </div> :  <h1>Please login</h1>}
    </div>
  );
};

export default HomeDiv;