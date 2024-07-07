"use client"

import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/navbar';
import { onAuthStateChangedListener } from '/app/firebase'; // Adjust path as necessary
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NoteAdder = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (user) {
        setUser(user);
        fetchNotes(user.uid);
      } else {
        setUser(null);
        setNotes([]);
      }
    });

    return () => unsubscribe();
  }, []);

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
    //   toast.error('Failed to fetch notes');
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
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  };

    return (
        <div className="bg-gray-900 text-white min-h-screen font-mono ">
            <Navbar />
            <h1 className='mx-auto justify-center items-center flex text-2xl text-yellow-700 mt-10'>Notes !</h1>
            <div className="container mx-auto py-2 max-w-7xl">
            <div
          className={`bg-gray-900 rounded-lg shadow-lg px-8 py-6 mb-8 border-gray-400 border mx-auto"
          } hover:border-yellow-700`}
        >
                    <div className="">
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className="w-full px-3 py-2 placeholder-gray-400 rounded-lg focus:outline-none bg-gray-900 text-white"
                            placeholder="Title.."
                            value={title}
                            onChange={handleTitleChange}
                        />
                    </div>
                    <div>
                        <textarea
                            id="content"
                            name="content"
                            rows="5"
                            className="w-full px-3 py-2 placeholder-gray-400 rounded-lg focus:outline-none bg-gray-900 text-white"
                            placeholder="Content"
                            value={content}
                            onChange={handleContentChange}
                            style={{ resize: "none" }} // add this line
                        ></textarea>

                    </div>
                    <button
                        className="flex items-center justify-center px-2 py-2 mt-4 text-white bg-gray-900 rounded-full hover:bg-yellow-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                        onClick={handleSave}
                    >
                        <svg className="w-6 h-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M14.328 10.172a.25.25 0 010 .354l-3.823 3.823a.25.25 0 01-.354 0l-3.823-3.823a.25.25 0 01.354-.354L10 12.293l3.328-3.328a.25.25 0 01.354 0z" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M10 0a10 10 0 100 20 10 10 0 000-20zM1.25 10a8.75 8.75 0 1117.5 0 8.75 8.75 0 01-17.5 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

        <div className="flex flex-wrap mx-auto ml-7 justify-center">
          {notes.map((note) => (
            <div
              key={note.note_id}
              className="bg-gray-900 rounded-lg shadow-lg px-8 py-6 mb-8 mr-8 max-w-md group relative break-words hover:border-yellow-700 border w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
            >
              <h3 className="font-mono font-extrabold text-white">{note.title}</h3>
              <p className="text-gray-300">{note.content}</p>
              <button
                className="absolute top-0 right-0 p-1 text-white hover:text-yellow-600 transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100"
                onClick={() => handleDelete(note.note_id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default NoteAdder;
