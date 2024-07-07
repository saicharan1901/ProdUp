import React from 'react';
import Link from 'next/link';
import Navbar from '../../components/navbar';

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white text-center mb-8">
            Welcome to Your Dashboard
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Notes Card */}
            <Link href="/dashboard/notes">
              <div className="cursor-pointer bg-white rounded-xl shadow-md p-6 transition duration-300 transform hover:scale-105">
                <h3 className="text-xl font-semibold text-gray-900 text-center mb-4">Notes</h3>
                <p className="text-gray-600 text-center">
                  Take down and save notes to keep track of your thoughts and ideas.
                </p>
              </div>
            </Link>
            {/* Reminders Card */}
            <Link href="/dashboard/reminders">
              <div className="cursor-pointer bg-white rounded-xl shadow-md p-6 transition duration-300 transform hover:scale-105">
                <h3 className="text-xl font-semibold text-gray-900 text-center mb-4">Reminders</h3>
                <p className="text-gray-600 text-center">
                  Set reminders for your tasks to ensure you never miss a deadline.
                </p>
              </div>
            </Link>
            {/* Todo List Card */}
            <Link href="/dashboard/todo">
              <div className="cursor-pointer bg-white rounded-xl shadow-md p-6 transition duration-300 transform hover:scale-105">
                <h3 className="text-xl font-semibold text-gray-900 text-center mb-4">Todo List</h3>
                <p className="text-gray-600 text-center">
                  Create and manage your todo list to stay organized and productive.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
