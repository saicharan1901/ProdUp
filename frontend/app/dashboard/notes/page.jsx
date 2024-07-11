"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/navbar';
import { onAuthStateChangedListener } from '/app/firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NoteAdder = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [notes, setNotes] = useState([]);
    const [user, setUser] = useState(null);
    const [editingNote, setEditingNote] = useState(null);
    const [color, setColor] = useState(null); // No default color initially
    const [showColorPalette, setShowColorPalette] = useState(false); // State to manage color palette visibility
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChangedListener((user) => {
            if (user) {
                setUser(user);
                fetchNotes(user.uid);
            } else {
                setUser(null);
                setNotes([]);
                router.push('/'); // Redirect to home page if not authenticated
            }
        });

        return () => unsubscribe();
    }, [router]);

    const fetchNotes = async (uid) => {
        try {
            const response = await fetch(`https://produpbackend.vercel.app/getnotes/${uid}`);
            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Failed to fetch notes');
            }
            const result = await response.json();
            setNotes(result.notes || []);
        } catch (error) {
            console.error('Error fetching notes:', error);
            toast.error('Failed to fetch notes');
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!title || !content) {
            toast.error('Title and content are required');
            return;
        }

        const noteColor = color || colors[0]; // Default color if no color is selected

        try {
            const response = await fetch('https://produpbackend.vercel.app/addnote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: user.uid, title, content, color: noteColor }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Failed to add note');
            }

            const newNote = { title, content, color: noteColor };
            setNotes([...notes, newNote]);
            setTitle('');
            setContent('');
            setColor(null); // Reset color
            toast.success('Note added successfully!');

            window.location.reload();
        } catch (error) {
            toast.error('Failed to add note');
            console.error('Error adding note:', error);
        }
    };

    const handleDelete = async (noteId) => {
        try {
            const response = await fetch(`https://produpbackend.vercel.app/deletenote/${noteId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Failed to delete note');
            }

            setNotes(notes.filter((note) => note.note_id !== noteId));
            toast.success('Note deleted successfully!');
            window.location.reload();
        } catch (error) {
            console.error('Error deleting note:', error);
            toast.error('Failed to delete note');
        }
    };

    if (!user) {
        return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen font-mono">
            <Navbar />
            <h1 className='mx-auto justify-center items-center flex text-4xl font-bold text-yellow-700 mt-10 animate-bounce'>Notes!</h1>
            <div className="container mx-auto py-8 max-w-7xl">
                <div className="bg-gray-800 rounded-lg shadow-lg px-8 py-6 mb-8 border-gray-600 border mx-auto hover:border-yellow-700 transition duration-300 transform hover:scale-105 hover:shadow-2xl">
                    <div className="mb-4">
                        <TextField
                            id="title"
                            label="Title"
                            variant="standard"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            InputProps={{
                                className: "text-white",
                                style: { color: 'white' },
                            }}
                            InputLabelProps={{
                                className: "text-white",
                                style: { color: 'white' },
                            }}
                        />
                    </div>
                    <div className="mb-4">
                        <TextField
                            id="content"
                            label="Content"
                            variant="standard"
                            fullWidth
                            multiline
                            rows={5}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            InputProps={{
                                className: "text-white",
                                style: { color: 'white' },
                            }}
                            InputLabelProps={{
                                className: "text-white",
                                style: { color: 'white' },
                            }}
                        />
                    </div>
                    <button
                        className="flex items-center justify-center px-4 py-2 mt-4 text-white bg-yellow-700 rounded-full hover:bg-yellow-800 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-700 focus:ring-opacity-50"
                        onClick={handleAddNote}
                    >
                        <svg className="w-6 h-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M14.328 10.172a.25.25 0 010 .354l-3.823 3.823a.25.25 0 01-.354 0l-3.823-3.823a.25.25 0 01.354-.354L10 12.293l3.328-3.328a.25.25 0 01.354 0z" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M10 0a10 10 0 100 20 10 10 0 000-20zM1.25 10a8.75 8.75 0 1117.5 0 8.75 8.75 0 01-17.5 0z" clipRule="evenodd" />
                        </svg>
                        Add Note
                    </button>
                </div>

            <div className="columns-1 sm:columns-1 md:columns-2 lg:columns-3 lg:max-w-7xl max-w-xl gap-6 mx-auto">
                {notes.map((note) => (
                    <div
                        key={note.note_id}
                        className="bg-gray-900 rounded-lg shadow-lg p-6 mb-6 break-inside-avoid break-words hover:border-yellow-700 border transition-all duration-300 ease-in-out transform hover:scale-105 relative"
                        style={{ backgroundColor: note.color || 'transparent' }} // Apply the note color
                    >
                        <h3 className="font-mono font-extrabold text-white">{note.title}</h3>
                        <p className="text-gray-300">{renderContent(note.content)}</p>
                        <br />

                        <div className='relative bottom-0 left-0 flex flex-row gap-5'>
                            <div>
                                <button
                                    className="p-1 text-white hover:text-yellow-600 transition-all duration-300 ease-in-out opacity-100 group-hover:opacity-100"
                                    onClick={() => startEditing(note)}
                                >
                                    <MdModeEditOutline />
                                </button>
                            </div>
                            <div>
                                <button
                                    className="p-1 text-white hover:text-red-600 transition-all duration-300 ease-in-out opacity-100 group-hover:opacity-100"
                                    onClick={() => handleDelete(note.note_id)}
                                >
                                    <MdDelete />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <ToastContainer />
        </div>
    );
};

export default NoteAdder;