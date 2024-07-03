import React from 'react';

const HomeDiv = () => {
  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-sky-800 to-sky-950 min-h-screen text-white">
      <div className="text-center p-8 rounded-lg ">
        <h1 className="text-6xl font-extrabold tracking-tight mb-6">
          Welcome to ProdUp
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Boost your productivity by scheduling tasks, setting reminders, and more!
        </p>
        <button
          className="px-8 py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white text-lg rounded-lg shadow-lg hover:scale-105 transform transition-transform hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default HomeDiv;
