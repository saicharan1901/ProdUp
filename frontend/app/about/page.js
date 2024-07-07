import React from "react";
import Navbar from "../../components/navbar";

// Sample data for developers
const developers = [
    {
        name: "Sai Charan",
        photo: "/charan.jpg", // Ensure you have the photo in the public/images directory
    },
    {
        name: "Yashwanth Reddy",
        photo: "/yashwanth.jpg",
    },
    {
        name: "Surya Abhiram",
        photo: "/abhiram.jpg",
    },
    {
        name: "Vasisht A.V.N.S.S",
        photo: "/vasisht.jpg",
    },
    {
        name: "Deepak Reddy",
        photo: "/deepak.jpg",
    },
];

export default function About() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700 text-gray-200">
                <div className="container mx-auto py-12 px-4">
                    <h1 className="text-5xl font-bold text-center mb-8 text-white animate__animated animate__fadeIn">About Us</h1>
                    <div className="relative overflow-hidden bg-gradient-to-r from-teal-500 to-purple-600 rounded-lg p-8 shadow-lg mb-16 mx-auto max-w-2xl">
                        <p className="text-center text-xl text-gray-100 leading-relaxed animate__animated animate__fadeIn animate__delay-1s">
                            Produp is a versatile app designed to streamline your productivity by efficiently arranging tasks, reminders, and to-do lists.
                            Whether you're managing personal projects or professional deadlines, Produp provides a user-friendly interface that ensures
                            you stay organized and on track. With customizable task lists, timely reminders, and intuitive scheduling features,
                            Produp empowers you to prioritize your work and achieve your goals with ease. Simplify your life and boost your productivity with Produp,
                            your ultimate task management companion.
                        </p>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-red-500 opacity-20 filter blur-lg"></div>
                    </div>
                    <h2 className="text-3xl font-bold text-center mb-12 text-white animate__animated animate__fadeIn animate__delay-2s">Meet Our Team</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12">
                        {developers.map((developer, index) => (
                            <div
                                key={index}
                                className="bg-gray-800 rounded-lg p-6 text-center shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl hover:rotate-1"
                            >
                                <img
                                    src={developer.photo}
                                    alt={developer.name}
                                    className="w-32 h-32 mx-auto rounded-full mb-4 border-4 border-gray-700 transition-transform transform hover:scale-110"
                                />
                                <h3 className="text-xl font-semibold text-white">{developer.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
