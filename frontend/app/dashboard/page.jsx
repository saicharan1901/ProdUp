import React from 'react';
import Link from 'next/link';
import Navbar from '../../components/navbar';
import { FaStickyNote, FaBell, FaListUl } from 'react-icons/fa';

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-sky-800 to-sky-950 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-center mb-12">
            Welcome to Your Dashboard
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Notes Card */}
            <Link href="/dashboard/notes">
              <div className="cursor-pointer  bg-gradient-to-r from-green-400 to-blue-500 rounded-xl shadow-lg p-8 transition-transform transform hover:scale-105 hover:shadow-2xl">
                <FaStickyNote className="text-4xl mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-center mb-4">Notes</h3>
                <p className="text-center">
                  Take down and save notes to keep track of your thoughts and ideas.
                </p>
              </div>
            </Link>
            {/* Reminders Card */}
            <Link href="/dashboard/reminders">
              <div className="cursor-pointer bg-gradient-to-r from-green-400 to-blue-500 rounded-xl shadow-lg p-8 transition-transform transform hover:scale-105 hover:shadow-2xl">
                <FaBell className="text-4xl mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-center mb-4">Reminders</h3>
                <p className="text-center">
                  Set reminders for your tasks to ensure you never miss a deadline.
                </p>
              </div>
            </Link>
            {/* Todo List Card */}
            <Link href="/dashboard/todo">
              <div className="cursor-pointer bg-gradient-to-r from-green-400 to-blue-500 rounded-xl shadow-lg p-8 transition-transform transform hover:scale-105 hover:shadow-2xl">
                <FaListUl className="text-4xl mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-center mb-4">Todo List</h3>
                <p className="text-center">
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
