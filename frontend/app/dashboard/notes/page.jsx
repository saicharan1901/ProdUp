"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/navbar';
import { onAuthStateChangedListener } from '/app/firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdModeEditOutline, MdDelete, MdPostAdd, MdFormatBold, MdFormatItalic } from "react-icons/md";
import { GrSave } from "react-icons/gr";
import ColorizeIcon from '@mui/icons-material/Colorize';
import TextField from '@mui/material/TextField';

const colors = ['#FFFFFF', '#F28B82', '#FBBC04', '#FFF475', '#CCFF90', '#A7FFEB', '#CBF0F8', '#AECBFA', '#D7AEFB', '#FDCFE8', '#E6C9A8', '#E8EAED'];

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

    const handleEditNote = async () => {
        if (!title || !content || !editingNote) {
            toast.error('Title, content, and note ID are required');
            return;
        }

        const noteColor = color || colors[0]; // Default color if no color is selected

        try {
            const response = await fetch(`https://produpbackend.vercel.app/editnote/${editingNote}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content, color: noteColor }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Failed to edit note');
            }

            setNotes(notes.map(note => note.note_id === editingNote ? { ...note, title, content, color: noteColor } : note));
            setTitle('');
            setContent('');
            setColor(null); // Reset color
            setEditingNote(null);
            toast.success('Note edited successfully!');
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
        setColor(note.color || colors[0]); // Set color to the note's color
        setEditingNote(note.note_id);
    };

    const toggleColorPalette = () => {
        setShowColorPalette(!showColorPalette);
    };

    const handleColorSelect = (selectedColor) => {
        setColor(selectedColor);
        setShowColorPalette(false); // Hide the color palette after selecting a color
    };

    const applyFormatting = (format) => {
        let textarea = document.getElementById('content');
        let start = textarea.selectionStart;
        let end = textarea.selectionEnd;
        let selectedText = content.substring(start, end);
        let beforeText = content.substring(0, start);
        let afterText = content.substring(end);

        let formattedText;
        if (format === 'bold') {
            formattedText = `**${selectedText}**`;
        } else if (format === 'italic') {
            formattedText = `*${selectedText}*`;
        }

        setContent(beforeText + formattedText + afterText);
    };

    const renderContent = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.split(urlRegex).map((part, index) =>
            urlRegex.test(part) ? (
                <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {part}
                </a>
            ) : (
                part
            )
        );
    };

    if (!user) {
        return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen font-mono">
            <Navbar />
            <div className="container mx-auto py-8 w-2/3 lg:w-1/2">
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
                    <div className="mb-4 flex gap-2 justify-left">
                        <button
                            className="flex items-center justify-center px-4 py-2 text-white bg-yellow-700 rounded-full hover:bg-yellow-800 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-700 focus:ring-opacity-50"
                            onClick={editingNote ? handleEditNote : handleAddNote}
                        >
                            {editingNote ? <GrSave size={20} /> : <MdPostAdd size={20} />}
                        </button>
                        <button
                            className="flex items-center justify-center px-4 py-2 text-white bg-yellow-700 rounded-full hover:bg-yellow-800 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-700 focus:ring-opacity-50"
                            onClick={toggleColorPalette}
                        >
                            <ColorizeIcon fontSize="small" />
                        </button>
                        <button
                            className="flex items-center justify-center px-4 py-2 text-white bg-yellow-700 rounded-full hover:bg-yellow-800 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-700 focus:ring-opacity-50"
                            onClick={() => applyFormatting('bold')}
                        >
                            <MdFormatBold size={20} />
                        </button>
                        <button
                            className="flex items-center justify-center px-4 py-2 text-white bg-yellow-700 rounded-full hover:bg-yellow-800 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-700 focus:ring-opacity-50"
                            onClick={() => applyFormatting('italic')}
                        >
                            <MdFormatItalic size={20} />
                        </button>
                    </div>
                    {showColorPalette && (
                        <div className="flex flex-wrap gap-2 mt-4 justify-end">
                            {colors.map((c) => (
                                <button
                                    key={c}
                                    className={`w-8 h-8 rounded-full ${c === color ? 'ring-2 ring-yellow-700' : ''}`}
                                    style={{ backgroundColor: c }}
                                    onClick={() => handleColorSelect(c)}
                                />
                            ))}
                        </div>
                    )}
                </div>
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