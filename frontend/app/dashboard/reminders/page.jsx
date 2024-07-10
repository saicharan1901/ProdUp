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
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center py-2">
        <ToastContainer />
        <h1 className="mx-auto justify-center items-center flex text-4xl font-bold text-yellow-700 mt-10">Set a Reminder</h1>
        <div className="mt-6 bg-gray-800 rounded-lg shadow-lg px-8 py-6 mb-8 border-gray-600 border mx-auto hover:border-yellow-700 transition duration-300 transform hover:-translate-y-1 hover:shadow-2xl">
          <div className="mb-4">
            <label htmlFor="day" className="block text-sm font-medium text-white font-bold">Day</label>
            <input
              id="day"
              type="date"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="w-full px-3 py-2 placeholder-gray-400 rounded-lg focus:outline-none bg-gray-700 text-white transition duration-300 transform focus:ring-2 focus:ring-yellow-700" />
          </div>
          <div className="mb-4">
            <label htmlFor="time" className="block text-sm font-medium text-white font-bold">Time</label>
            <input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 placeholder-gray-400 rounded-lg focus:outline-none bg-gray-700 text-white transition duration-300 transform focus:ring-2 focus:ring-yellow-700" />
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-white font-bold">Message</label>
            <input
              id="message"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 placeholder-gray-400 rounded-lg focus:outline-none bg-gray-700 text-white transition duration-300 transform focus:ring-2 focus:ring-yellow-700" />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleAddReminder}
              className="flex items-center justify-center px-4 py-2 mt-4 text-white bg-yellow-700 rounded-full hover:bg-yellow-800 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-700 focus:ring-opacity-50"
            >
              Add Reminder
            </button>
          </div>
        </div>
        <div className="mt-6">
          <SoundComponent />
        </div>
      </div>
    </>
  );
};

export default Reminders;
