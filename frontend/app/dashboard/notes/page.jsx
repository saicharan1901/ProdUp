"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import Navbar from '../../../components/navbar';
import { onAuthStateChangedListener } from '/app/firebase'; // Adjust path as necessary
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const NoteAdder = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState(null);
  const [editNoteId, setEditNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter(); // Initialize useRouter

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
      // toast.error('Failed to fetch notes');
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

      window.location.reload(); // Optional: Reload the page to reflect the new note
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
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  };

  const handleEdit = (note) => {
    setEditNoteId(note.note_id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditModalOpen(true);
  };

  const handleUpdateNote = async () => {
    if (!editTitle || !editContent) {
      toast.error('Title and content are required');
      return;
    }

    try {
      const response = await fetch(`https://produpbackend.vercel.app/updatenote/${editNoteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: editTitle, content: editContent }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to update note');
      }

      const updatedNote = { note_id: editNoteId, title: editTitle, content: editContent };
      setNotes(notes.map((note) => (note.note_id === editNoteId ? updatedNote : note)));
      setIsEditModalOpen(false);
      toast.success('Note updated successfully!');
    } catch (error) {
      toast.error('Failed to update note');
      console.error('Error updating note:', error);
    }
  };

  if (!user) {
    // Optionally, render a loading state or placeholder while checking auth status
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"> <CircularProgress color="inherit" /></div>;
  }   
  

  return (
    <div className="bg-gray-900 text-white min-h-screen font-mono">
      <Navbar />
      <h1 className='mx-auto justify-center items-center flex text-4xl font-bold text-yellow-700 mt-10 animate-bounce'>Notes!</h1>
      <div className="container mx-auto py-8 max-w-7xl">
        <div className="bg-gray-800 rounded-lg shadow-lg px-8 py-6 mb-8 border-gray-600 border mx-auto hover:border-yellow-700 transition duration-300 transform hover:-translate-y-1 hover:shadow-2xl">
          <div className="mb-4">
            <input
              type="text"
              id="title"
              name="title"
              className="w-full px-3 py-2 placeholder-gray-400 rounded-lg focus:outline-none bg-gray-700 text-white transition duration-300 transform focus:ring-2 focus:ring-yellow-700"
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
              className="w-full px-3 py-2 placeholder-gray-400 rounded-lg focus:outline-none bg-gray-700 text-white transition duration-300 transform focus:ring-2 focus:ring-yellow-700"
              placeholder="Content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ resize: "none" }}
            ></textarea>
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

        
<div className="flex flex-wrap mx-auto ml-7 justify-center">
    {notes.map((note) => (
        <div
            key={note.note_id}
            className="bg-gray-900 rounded-lg shadow-lg px-8 py-6 mb-8 mr-8 max-w-md group relative break-words hover:border-yellow-700 border w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex-grow"
        >
            <h3 className="font-mono font-extrabold text-white">{note.title}</h3>
            <p className="text-gray-300">{note.content}</p>
            <div className="absolute top-10 right-10 flex p-o space-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                <IconButton aria-label="delete" size="large" sx={{ color: 'white' }} onClick={() => handleDelete(note.note_id)}>
                    <DeleteIcon />
                </IconButton>
                <IconButton aria-label="edit" size="large" sx={{ color: 'white' }} onClick={() => handleEdit(note)}>
                    <EditIcon />
                </IconButton>
            </div>
        </div>
    ))}
</div>

      </div>
      <ToastContainer />
      <Modal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        aria-labelledby="edit-note-modal-title"
        aria-describedby="edit-note-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2 id="edit-note-modal-title">Edit Note</h2>
          <TextField
            id="edit-title"
            label="Title"
            variant="outlined"
            fullWidth
            margin="normal"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <TextField
            id="edit-content"
            label="Content"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateNote}
            sx={{ mt: 2 }}
          >
            Save Changes
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default NoteAdder;
