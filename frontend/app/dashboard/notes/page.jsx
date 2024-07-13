"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/navbar';
import { onAuthStateChangedListener } from '/app/firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdModeEditOutline, MdDelete, MdPostAdd, MdFormatBold, MdFormatItalic, MdMic } from "react-icons/md";
import { GrSave } from "react-icons/gr";
import ColorizeIcon from '@mui/icons-material/Colorize';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Sidebar from './sidebar';

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
    const [selectedFolder, setSelectedFolder] = useState('All');
    const [folders, setFolders] = useState([]);
    const [newFolderName, setNewFolderName] = useState('');
    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const [selectedNoteId, setSelectedNoteId] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChangedListener((user) => {
            if (user) {
                setUser(user);
                fetchNotes(user.uid);
                fetchFolders(user.uid)
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

    const fetchFolders = async (uid) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/getfolders/${uid}`);
            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Failed to fetch folders');
            }
            const result = await response.json();
            return (result.folders || []);
        } catch (error) {
            console.error('Error fetching folders:', error);
            return []; // Return an empty array or handle the error as per your application's needs
        }
    };

    const handleAddToFolder = async (noteId, folderId) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/addtofolder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ note_id: noteId, folder_id: folderId }),
            });
            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Failed to add note to folder');
            }
            const result = await response.json();
            console.log(result.message);
            // Optionally update notes state to reflect changes
        } catch (error) {
            console.error('Error adding note to folder:', error);
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

            setNotes(notes.map(note => note.note_id === editingNote ? { ...note, title, content, bgcolor: noteColor } : note));
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

    // const handleCreateFolder = (e) => {
    //     e.preventDefault();
    //     if (!newFolderName) {
    //         toast.error('Folder name is required');
    //         return;
    //     }

    //     setFolders([...folders, newFolderName]);
    //     setNewFolderName('');
    // };

    if (!user) {
        return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><CircularProgress /></div>;
    }


    const handleCreateFolder = async (e) => {
        e.preventDefault();
        if (!newFolderName) {
            toast.error('Folder name is required');
            return;
        }

        if (!user || !user.uid) {
            toast.error('User is not authenticated');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/addfolder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ folder_name: newFolderName, user_id: user.uid }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Failed to add folder');
            }

            const newFolder = { folder_name: newFolderName, user_id: user.uid };
            setFolders([...folders, newFolder]);
            setNewFolderName('');
            toast.success('Folder added successfully!');
        } catch (error) {
            console.error('Error adding folder:', error);
            toast.error('Failed to add folder');
        }
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

    return (
        <><Navbar /><div className="bg-gray-900 text-white flex flex-row gap-10 lg:h-screen min-h-screen font-mono">
            {/* <div className='lg:w-1/4 hidden lg:block h-full bg-gray-900 overflow-hidden '>
                <h2 className="text-xl font-bold mb-4">Folders</h2>
                <ul>
                    {folders.map((folder) => (
                        <li
                            key={folder.id}
                            className={`cursor-pointer p-4 justify-center bg-gray-900 hover:bg-gray-700 ${selectedFolder === folder.folder_name ? 'text-yellow-500' : ''}`}
                            onClick={() => setSelectedFolder(folder.folder_name)}
                        >
                            {folder.folder_name}
                        </li>
                    ))}
                </ul>
                <form onSubmit={handleCreateFolder} className="mt-4 flex h-24 justify-start flex-row">
                    <TextField
                        label="New folder Name"
                        variant="standard"
                        fullWidth
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        InputProps={{
                            className: "text-white",
                            style: { color: 'white' },
                        }}
                        InputLabelProps={{
                            className: "text-white",
                            style: { color: 'white' },
                        }}
                        className=' w-6/12'
                    />
                    <div className='justify-center grid'>
                        <button
                            type="submit"
                            className="  bg-yellow-500 w-10 h-10 p-4 justify-center items-center flex text-black rounded"
                        >
                            +
                        </button>
                    </div>
                </form>
            </div> */}
            <div className="container mx-auto lg:py-8 py-1 lg:w-3/4 w-full lg:overflow-y-auto">
                <div className="bg-gray-800 rounded-lg shadow-lg px-8 lg:w-1/2 py-6 mb-8 mx-auto transition-all ease-in-out duration-300 hover:-translate-y-1 transform">
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
                            }} />
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
                            }} />
                    </div>
                    <div className="mb-4 flex gap-2 justify-left">
                        <button
                            className="flex items-center justify-center px-4 py-2 text-white bg-yellow-700 rounded-full hover:bg-yellow-800 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-double focus:ring-2 focus:ring-yellow-700 focus:ring-opacity-50"
                            onClick={editingNote ? handleEditNote : handleAddNote}
                        >
                            {editingNote ? <GrSave size={20} /> : <MdPostAdd size={20} />}
                        </button>
                        <button
                            className="flex items-center justify-center px-4 py-2 text-white bg-yellow-700 rounded-full hover:bg-yellow-800 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-double focus:ring-2 focus:ring-yellow-700 focus:ring-opacity-50"
                            onClick={toggleColorPalette}
                        >
                            <ColorizeIcon fontSize="small" />
                        </button>
                        <button onClick={handleSpeechRecognition} className="flex items-center justify-center px-4 py-2 text-white bg-yellow-700 rounded-full hover:bg-yellow-800 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-double focus:ring-2 focus:ring-yellow-700 focus:ring-opacity-50">
                            <MdMic />
                        </button>

                        {/* <button
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
    </button> */}
                    </div>
                    {showColorPalette && (
                        <div className="flex flex-wrap bottom-0 left-0 gap-2 mt-4 justify-start">
                            {colors.map((c) => (
                                <button
                                    key={c}
                                    className={`w-8 h-8 rounded-full ${c === color ? 'ring-3 ring-green-500 focus:outline-double' : ''}`}
                                    style={{ backgroundColor: c }}
                                    onClick={() => handleColorSelect(c)} />
                            ))}
                        </div>
                    )}
                </div>
                <div className="columns-2 sm:columns-1 md:columns-2 lg:columns-3 lg:max-w-7xl max-w-full gap-6 mx-auto">
                    {notes.map((note) => (
                        <div
                            key={note.note_id}
                            className="bg-gray-900 rounded-lg shadow-lg p-6 mb-6 break-inside-avoid break-words transition-all duration-300 ease-in-out transform hover:-translate-y-1 relative"
                            style={{ backgroundColor: note.color || 'transparent' }} // Apply the note color
                        >
                            <h3 className="font-extrabold text-white text-xl">{note.title}</h3>
                            <p className="text-white text-xs">{renderContent(note.content)}</p>
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

                                {/* <button
                                    onClick={() => setSelectedNoteId(note.id)}
                                    className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
                                >
                                    Add to Folder
                                </button>
                                {selectedNoteId === note.id && (
                                    <div>
                                        <select
                                            onChange={(e) => setSelectedFolderId(e.target.value)}
                                            value={selectedFolderId || ""}
                                        >
                                            <option value="" disabled>Select Folder</option>
                                            {folders.map((folder) => (
                                                <option key={folder.id} value={folder.id}>
                                                    {folder.folder_name}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => handleAddToFolder(note.id, selectedFolderId)}
                                            className="bg-green-500 text-white px-2 py-1 rounded mt-2"
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                )} */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            <ToastContainer />
        </div></>
    );
};

export default NoteAdder;

