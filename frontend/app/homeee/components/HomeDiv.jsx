"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChangedListener, signInWithGoogle } from '@/app/firebase'; // Ensure path is correct

const HomeDiv = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if the user is already authenticated
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (user) {
        setUser(user);
        // Redirect to home page to show the Get Started button
        router.push('/');
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe(); // Clean up subscription on unmount
  }, [router]);

  const handleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      setUser(result.user); // Access the user property from the returned data
      // Redirect to home page after successful login
      router.push('/');
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-900 min-h-screen text-white">
      <div className="text-center">
        {user ? (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-sky-300 mb-4 shadow-lg p-4 rounded-lg">
            Welcome <span role="img" aria-label="wave">👋</span> {user.displayName}!
            </h1>
            
          <img src={user.photoURL} alt="Profile" className="w-24 h-24 rounded-full mb-4" />
          <button
            onClick={() => router.push('/dashboard')}
            className="px-8 py-4 bg-blue-600 text-white text-lg rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Get Started
          </button>
        </div>
        
        ) : (
          <div>
            <h1 className="text-6xl font-extrabold animate-bounce text-gray-200 mb-4">
              Welcome to ProdUp
            </h1>
            <p className="text-xl text-gray-600 mb-8 animate-pulse">
              Boost your productivity by scheduling tasks, setting reminders, and more!
            </p>
            <button
              onClick={handleSignIn}
              className="px-8 py-4 bg-blue-600 text-white text-lg rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign In with Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeDiv;
