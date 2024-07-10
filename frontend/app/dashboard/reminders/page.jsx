"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useSound from './hook';
import Navbar from '../../../components/navbar';
import { onAuthStateChangedListener } from '/app/firebase'; // Adjust path as necessary

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const [playSound, stopSound, SoundComponent] = useSound('/reminder.mp3');
  const reminderTimeoutRef = useRef(null);
  const currentToastId = useRef(null);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (!user) {
        router.push('/'); // Redirect to home page if not authenticated
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      reminders.forEach(reminder => {
        const reminderTime = new Date(reminder.dateTime);
        if (now >= reminderTime && now <= new Date(reminderTime.setSeconds(reminderTime.getSeconds() + 60))) {
          if (currentToastId.current === null) {
            playSound();
            showReminderToast(reminder.message);
          }
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [reminders, playSound]);

  const showReminderToast = (message) => {
    if (currentToastId.current !== null) {
      toast.dismiss(currentToastId.current);
    }

    currentToastId.current = toast.info(
      <div className="flex flex-col items-start">
        <span>{message}</span>
      </div>,
      { autoClose: false, closeOnClick: false }
    );

    if (reminderTimeoutRef.current) {
      clearTimeout(reminderTimeoutRef.current);
    }

    reminderTimeoutRef.current = setTimeout(handleStopReminder, 60000);
  };

  const handleStopReminder = () => {
    stopSound();
    if (currentToastId.current !== null) {
      toast.dismiss(currentToastId.current);
      currentToastId.current = null;
    }
    if (reminderTimeoutRef.current) {
      clearTimeout(reminderTimeoutRef.current);
    }
  };

  const handleAddReminder = () => {
    const reminderDateTime = new Date(day + 'T' + time); // Fixing datetime format for compatibility
    const newReminder = { dateTime: reminderDateTime, message: message };
    setReminders([...reminders, newReminder]);
    toast.success('Reminder added successfully!', { position: "top-right" });
    setDay('');
    setTime('');
    setMessage('');
  };

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center py-2 bg-gray-900"
      >
        <ToastContainer />
        <h1 className="text-5xl text-white font-extrabold mb-8 ">Set a Reminder</h1>
        <div className="bg-gray-800 shadow-xl rounded-lg p-8 w-full max-w-sm animate__animated animate__zoomIn transition-transform transform hover:scale-105">
          <div className="mb-6">
            <label htmlFor="day" className="block text-lg font-medium text-white">Day</label>
            <input
              id="day"
              type="date"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-lg transition duration-150 ease-in-out transform hover:scale-105 bg-white text-gray-800" />
          </div>
          <div className="mb-6">
            <label htmlFor="time" className="block text-lg font-medium text-white">Time</label>
            <input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-lg transition duration-150 ease-in-out transform hover:scale-105 bg-white text-gray-800" />
          </div>
          <div className="mb-8">
            <label htmlFor="message" className="block text-lg font-medium text-white">Message</label>
            <input
              id="message"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-lg transition duration-150 ease-in-out transform hover:scale-105 bg-white text-gray-800" />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleAddReminder}
              className="inline-flex items-center px-5 py-3 border border-transparent text-lg font-medium rounded-lg shadow-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out transform hover:scale-105"
            >
              Add Reminder
            </button>
          </div>
        </div>
        <div className="mt-8 animate__animated animate__fadeInUp">
          <SoundComponent />
        </div>
      </div>
    </>
  );
};

export default Reminders;
