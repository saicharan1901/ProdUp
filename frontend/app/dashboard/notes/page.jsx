"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/navbar';
import { onAuthStateChangedListener } from '/app/firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdModeEditOutline, MdDelete, MdPostAdd, MdFormatBold, MdFormatItalic, MdMic } from "react-icons/md"; // Import MdMic icon
import { GrSave } from "react-icons/gr";
import ColorizeIcon from '@mui/icons-material/Colorize';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

const colors = ['#000000', '#A52A2A', '#FF8C00', '#B8860B', '#556B2F', '#2E8B57', '#4682B4', '#1E90FF', '#8A2BE2', '#DA70D6', '#8B4513', '#708090'];

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
                body: JSON.stringify({ user_id: user.uid, title, content, bgcolor: noteColor }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Failed to add note');
            }

            const newNote = { title, content };
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
                body: JSON.stringify({ title, content, bgcolor: noteColor }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Failed to edit note');
            }

            setNotes(notes.map(note => note.note_id === editingNote ? { ...note, title, content, bgcolor: noteColor} : note));
            setTitle('');
            setContent('');
            setColor(null); // Reset color
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

    const handleSpeechRecognition = () => {
        if (!('webkitSpeechRecognition' in window)) {
            toast.error('Speech recognition not supported in this browser.');
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setContent(content + ' ' + transcript);
        };

        recognition.onerror = (event) => {
            toast.error('Speech recognition error: ' + event.error);
        };

        recognition.onend = () => {
            toast.info('Speech recognition ended.');
        };
    };

    if (!user) {
        return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><CircularProgress /></div>;
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
                    <div className="mb-4 flex justify-center">
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            onClick={editingNote ? handleEditNote : handleAddNote}
                        >
                            {editingNote ? 'Save' : 'Add Note'}
                        </button>
                    </div>
                    <div className="flex justify-center mb-4">
                        <button onClick={handleSpeechRecognition} className="text-3xl text-yellow-500 hover:text-yellow-600 focus:outline-none">
                            <MdMic />
                        </button>
                    </div>
                    <div className="flex justify-center mb-4">
                        <button onClick={toggleColorPalette} className="text-3xl text-yellow-500 hover:text-yellow-600 focus:outline-none">
                            <ColorizeIcon />
                        </button>
                    </div>
                    {showColorPalette && (
                        <div className="color-palette mb-4">
                            {colors.map((color, index) => (
                                <div
                                    key={index}
                                    className="color-swatch inline-block w-6 h-6 mx-1 border border-gray-600 rounded cursor-pointer"
                                    style={{ backgroundColor: color }}
                                    onClick={() => handleColorSelect(color)}
                                ></div>
                            ))}
                        </div>
                    )}
                </div>
                {notes.length > 0 && (
                    <div className="bg-gray-800 rounded-lg shadow-lg px-8 py-6 border-gray-600 border mx-auto hover:border-yellow-700 transition duration-300 transform hover:scale-105 hover:shadow-2xl">
                        {notes.map((note) => (
                            <div key={note.note_id} className="mb-4 p-4 rounded-lg" style={{ backgroundColor: note.bgcolor || colors[0] }}>
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-xl font-bold text-white">{note.title}</h2>
                                    <div>
                                        <button onClick={() => startEditing(note)} className="text-2xl text-white hover:text-yellow-600 focus:outline-none">
                                            <MdModeEditOutline />
                                        </button>
                                        <button onClick={() => handleDelete(note.note_id)} className="text-2xl text-white hover:text-red-600 focus:outline-none ml-2">
                                            <MdDelete />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-white">{renderContent(note.content)}</p>
                            </div>
                        ))}
                    </div>
                )}
                <ToastContainer />
            </div>
        </div>
    );
};

export default NoteAdder;
