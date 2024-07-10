"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import Navbar from '../../../components/navbar';
import { onAuthStateChangedListener } from '/app/firebase'; // Adjust path as necessary
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdModeEditOutline, MdDelete } from "react-icons/md";

const Modal = ({ isOpen, onClose, onSave, title, content, setTitle, setContent }) => {
    if (!isOpen) return null;

    const handleSave = () => {
        onSave();
        onClose();
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Edit Note</h2>
                <input
                    type="text"
                    id="title"
                    name="title"
                    className="w-full px-3 py-2 placeholder-gray-400 rounded-lg focus:outline-none bg-gray-100 text-gray-800 transition duration-300 transform focus:ring-2"
                    placeholder="Title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    id="content"
                    name="content"
                    rows="5"
                    className="w-full mt-2 px-3 py-2 placeholder-gray-400 rounded-lg focus:outline-none bg-gray-100 text-gray-800 transition duration-300 transform focus:ring-2"
                    placeholder="Content..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{ resize: "none" }}
                ></textarea>
                <div className="flex justify-end mt-4">
                    <button
                        className="px-4 py-2 bg-yellow-700 text-white rounded-md hover:bg-yellow-800 transition duration-300 ease-in-out"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                    <button
                        className="ml-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-300 ease-in-out"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

const NoteAdder = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [notes, setNotes] = useState([]);
    const [user, setUser] = useState(null);
    const [editingNote, setEditingNote] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
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

        try {
            const response = await fetch('https://produpbackend.vercel.app/addnote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: user.uid, title, content }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Failed to add note');
            }

            const newNote = { title, content };
            setNotes([...notes, newNote]);
            setTitle('');
            setContent('');
            toast.success('Note added successfully!');

            window.location.reload('Brother'); // Optional: Reload the page to reflect the new note
        } catch (error) {
            toast.error('Failed to add note');
            console.error('Error adding note:', error);
        }
    };

    const handleEditNote = async () => {
        if (!title || !content || !editingNote) {
            toast.error('Title, content, and note ID are required');
            return;
        }

        try {
            const response = await fetch(`https://produpbackend.vercel.app/editnote/${editingNote}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Failed to edit note');
            }

            setNotes(notes.map(note => note.note_id === editingNote ? { ...note, title, content } : note));
            setTitle('');
            setContent('');
            setEditingNote(null);
            toast.success('Note edited successfully!');

            window.location.reload();
        } catch (error) {
            toast.error('Failed to edit note');
            console.error('Error editing note:', error);
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

    const startEditing = (note) => {
        setTitle(note.title);
        setContent(note.content);
        setEditingNote(note.note_id);
        setModalOpen(true);
    };

    if (!user) {
        return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen font-mono">
            <Navbar />
            <h1 className='mx-auto justify-center items-center flex text-4xl font-bold text-yellow-700 mt-10 animate-bounce'>Notes!</h1>
            <div className="container mx-auto py-8 w-2/3 lg:w-1/2">
                <div className="bg-gray-800 rounded-lg shadow-lg px-8 py-6 mb-8 border-gray-600 border mx-auto hover:border-yellow-700 transition duration-300 transform hover:scale-105 hover:shadow-2xl">
                    <div className="mb-4">
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className="w-full px-3 py-2 placeholder-gray-400 rounded-lg focus:outline-none bg-transparent text-white transition duration-300 transform focus:ring-2"
                            placeholder="Title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <textarea
                            id="content"
                            name="content"
                            rows="5"
                            className="w-full px-3 py-2 placeholder-gray-400 rounded-lg focus:outline-none bg-transparent text-white transition duration-300 transform focus:ring-2"
                            placeholder="Content..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            style={{ resize: "none" }}
                        ></textarea>
                    </div>
                    <button
                        className="flex items-center justify-center px-4 py-2 mt-4 text-white bg-yellow-700 rounded-full hover:bg-yellow-800 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-700 focus:ring-opacity-50"
                        onClick={editingNote ? handleEditNote : handleAddNote}
                    >
                        <svg className="w-6 h-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d={editingNote ? "M16.862 3.138a1.5 1.5 0 00-2.121 0L7.5 10.379l-.379.38L5 13l.379-.379 7.24-7.241a1.5 1.5 0 000-2.121z" : "M14.328 10.172a.25.25 0 010 .354l-3.823 3.823a.25.25 0 01-.354 0l-3.823-3.823a.25.25 0 01.354-.354L10 12.293l3.328-3.328a.25.25 0 01.354 0z"} clipRule="evenodd" />
                            <path fillRule="evenodd" d="M10 0a10 10 0 100 20 10 10 0 000-20zM1.25 10a8.75 8.75 0 1117.5 0 8.75 8.75 0 01-17.5 0z" clipRule="evenodd" />
                        </svg>
                        {editingNote ? 'Save Note' : 'Add Note'}
                    </button>
                </div>
            </div>

            <div className="columns-1 sm:columns-1 md:columns-2 lg:columns-3 lg:max-w-7xl max-w-xl gap-6 mx-auto">
                {notes.map((note) => (
                    <div
                        key={note.note_id}
                        className="bg-gray-900 rounded-lg shadow-lg p-6 mb-6 break-inside-avoid break-words hover:border-yellow-700 border transition-all duration-300 ease-in-out transform hover:scale-105 relative"
                    >
                        <h3 className="font-mono font-extrabold text-white">{note.title}</h3>
                        <p className="text-gray-300">{note.content}</p>
                        <br />

                        <div className=' relative bottom-0 left-0 flex flex-row gap-5'>
                            <div>
                                <button
                                    className=" p-1 text-white hover:text-yellow-600 transition-all duration-300 ease-in-out opacity-100 group-hover:opacity-100"
                                    onClick={() => startEditing(note)}
                                >
                                    <MdModeEditOutline />
                                </button>
                            </div>
                            <div>
                                <button
                                    className=" p-1 text-white hover:text-red-600 transition-all duration-300 ease-in-out opacity-100 group-hover:opacity-100"
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

            <Modal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setTitle('');
                    setContent('');
                    setEditingNote(null);
                }}
                onSave={editingNote ? handleEditNote : handleAddNote}
                title={title}
                content={content}
                setTitle={setTitle}
                setContent={setContent}
            />
        </div>
    );
};

export default NoteAdder;
