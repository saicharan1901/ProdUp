import React from 'react';

const HomeDiv = () => {
  return (
    <div
      className="relative flex items-center justify-end min-h-screen bg-gradient-to-br from-sky-800 to-sky-950 text-white"
      style={{
        backgroundImage: `url("/home image.png")`,
        backgroundSize: '55% auto',
        backgroundPosition: 'left -10%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60 "></div> {/* Overlay */}
      <div className="relative text-center p-8 rounded-lg z-10 m-8">
        <h1 className="text-6xl font-extrabold tracking-tight mb-6 animate-pulse text-black">
          Welcome to ProdUp
        </h1>
        <p className="text-lg text-black mb-8 font-extrabold">
          Boost your productivity by scheduling tasks, setting reminders, and more!
        </p>
        <button
          className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white text-lg rounded-lg shadow-lg hover:scale-105 transform transition-transform hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default HomeDiv;

