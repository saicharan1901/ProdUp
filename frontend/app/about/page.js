import React from "react";
import Navbar from "../../components/navbar";

export default function About() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen text-gray-200 bg-gray-900">
                This is about page
            </div>
        </>
    );
}