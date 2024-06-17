"use client";

import { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useSound from './hook';
import Navbar from '../../../components/navbar';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const [playSound, stopSound, SoundComponent] = useSound('/reminder.mp3');
  const reminderTimeoutRef = useRef(null);
  const currentToastId = useRef(null);

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

    <><Navbar /><div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center py-2">
          <ToastContainer />
          <h1 className="text-3xl text-white font-bold mb-6">Set a Reminder</h1>
          <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
              <div className="mb-4">
                  <label htmlFor="day" className="block text-sm font-medium text-gray-700">Day</label>
                  <input
                      id="day"
                      type="date"
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="mb-4">
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                  <input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                  <input
                      id="message"
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="flex justify-end">
                  <button
                      onClick={handleAddReminder}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                      Add Reminder
                  </button>
              </div>
          </div>
          <div className="mt-6">
              <SoundComponent />
          </div>
      </div></>
  );
};

export default Reminders;
