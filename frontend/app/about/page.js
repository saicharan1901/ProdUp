import React from "react";
import Navbar from "../../components/navbar";

// Sample data for developers
const developers = [
    {
        name: "Sai Charan",
        role: "Team Lead",
        photo: "/charan.jpeg", // Ensure you have the photo in the public/images directory
    },
    {
        name: "Yashwanth Reddy",
        role: "Backend Developer",
        photo: "/yashwanth.jpeg",
    },
    {
        name: "Surya Abhiram",
        role: "UI/UX Designer",
        photo: "/Abhiram.jpeg",
    },
    {
        name: "Vasisht A.V.N.S.S",
        role: "UI/UX Designer",
        photo: "/vasisht.jpeg",
    },
    {
        name: "Deepak Reddy",
        photo: "/deepak.jpeg",
    },
];

export default function About() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-sky-950 text-gray-200">
                <div className="container mx-auto py-12 px-4">
                    <h1 className="text-5xl font-bold text-center mb-8 text-white">About Us</h1>
                    <p className="text-center max-w-2xl mx-auto mb-16 text-gray-300 leading-relaxed">
                        Produp is a versatile app designed to streamline your productivity by efficiently arranging tasks, reminders, and to-do lists.
                        Whether you're managing personal projects or professional deadlines, Produp provides a user-friendly interface that ensures
                        you stay organized and on track. With customizable task lists, timely reminders, and intuitive scheduling features,
                        Produp empowers you to prioritize your work and achieve your goals with ease. Simplify your life and boost your productivity with Produp,
                        your ultimate task management companion.
                    </p>
                    <h2 className="text-3xl font-bold text-center mb-12 text-white">Meet Our Team</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12">
                        {developers.map((developer, index) => (
                            <div key={index} className="bg-gray-800 rounded-lg p-6 text-center shadow-lg transform transition-transform hover:scale-105">
                                <img
                                    src={developer.photo}
                                    alt={developer.name}
                                    className="w-32 h-32 mx-auto rounded-full mb-4 border-4 border-gray-700"
                                />
                                <h3 className="text-xl font-semibold text-white">{developer.name}</h3>
                                <p className="text-gray-400">{developer.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
