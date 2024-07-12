"use client";

import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../../../components/navbar';
import { useRouter } from 'next/navigation'; // Update import if necessary
import { onAuthStateChangedListener } from '/app/firebase'; // Adjust path as necessary
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import ListIcon from '@mui/icons-material/List';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import TextField from '@mui/material/TextField';
import { motion } from 'framer-motion'; // For animations
import AddIcon from '@mui/icons-material/Add';

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [recentlyDeletedTodos, setRecentlyDeletedTodos] = useState([]);
  const [todoText, setTodoText] = useState('');
  const [tagText, setTagText] = useState('');
  const [view, setView] = useState('all');
  const router = useRouter(); // For navigation

  useEffect(() => {
    // Authentication check
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (!user) {
        router.push('/'); // Redirect to home page if not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, [router]);

  const handleAddTodo = () => {
    if (!todoText.trim()) {
      toast.error('Todo cannot be empty!');
      return;
    }

    const newTodo = {
      id: todos.length + 1,
      text: todoText,
      done: false,
      tags: tagText.trim() !== '' ? tagText.trim().split(',') : [],
      important: false,
    };

    setTodos([...todos, newTodo]);
    setTodoText('');
    setTagText('');

    toast.success('Todo added successfully!', { position: "top-right" });
  };

  const handleToggleDone = (id) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    );
    setTodos(updatedTodos);
  };

  const handleDeleteTodo = (id) => {
    const todoToDelete = todos.find(todo => todo.id === id);
    if (todoToDelete) {
      setRecentlyDeletedTodos([...recentlyDeletedTodos, todoToDelete]);
      const updatedTodos = todos.filter(todo => todo.id !== id);
      setTodos(updatedTodos);
      toast.error('Todo deleted!', { position: "top-right" });
    }
  };

  const handleToggleImportant = (id) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, important: !todo.important } : todo
    );
    setTodos(updatedTodos);
  };

  const filteredTodos = todos.filter(todo => {
    if (view === 'all') return true;
    if (view === 'starred') return todo.important;
    if (view === 'completed') return todo.done;
    return true;
  });

  const filteredRecentlyDeletedTodos = recentlyDeletedTodos.filter(todo => view === 'deleted');

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 flex">
        <ToastContainer />
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-1/6 bg-gray-800 flex flex-col items-center py-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setView('all')}
            className="w-full py-2 text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-yellow-600 mb-2 flex items-center justify-center"
          >
            <ListIcon className="mr-2" /> All
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setView('starred')}
            className="w-full py-2 text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-yellow-600 mb-2 flex items-center justify-center"
          >
            <StarRoundedIcon className="mr-2" /> Starred
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setView('completed')}
            className="w-full py-2 text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-yellow-600 mb-2 flex items-center justify-center"
          >
            <CheckCircleRoundedIcon className="mr-2" /> Completed
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setView('deleted')}
            className="w-full py-2 text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-yellow-600 mb-2 flex items-center justify-center"
          >
            <DeleteRoundedIcon className="mr-2" /> Recently Deleted
          </motion.button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-4/5 bg-gray-900 flex flex-col items-center py-4"
        >
          <h1 className="text-4xl font-bold text-white mb-8">Todo List</h1>
          {(view !== 'deleted' ? filteredTodos : filteredRecentlyDeletedTodos).map(todo => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between bg-gray-200 px-4 py-2 mb-2 rounded-md shadow-sm w-full"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={todo.done}
                    onChange={() => handleToggleDone(todo.id)}
                    className="form-checkbox h-5 w-5 text-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  />
                  <p className={`ml-2 text-lg ${todo.done ? 'line-through' : ''}`}>{todo.text}</p>
                  {view !== 'deleted' && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleImportant(todo.id)}
                      className="text-yellow-500 hover:text-yellow-700 focus:outline-none ml-2"
                    >
                      {todo.important ? <StarRoundedIcon /> : <StarBorderRoundedIcon />}
                    </motion.button>
                  )}
                </div>
                <div className="flex items-center">
                  {todo.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-blue-200 text-blue-800 rounded-full mr-1">{tag}</span>
                  ))}
                  {view !== 'deleted' && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="text-red-500 hover:text-red-700 focus:outline-none ml-2"
                    >
                      <DeleteRoundedIcon />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
            
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          className='w-full bottom-0 inset-x-0 absolute'
          >
            {/* Display added tasks input below title */}
            <div className="flex items-center">
              <TextField
                id="fullWidth"
                label="Add your task"
                variant="standard"
                value={todoText}
                onChange={(e) => setTodoText(e.target.value)}
                fullWidth
                InputProps={{
                  className: "text-white",
                  style: { borderBottom: '1px solid white', color: 'white', width: '100%' },
                }}
                InputLabelProps={{
                  className: "text-white",
                }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddTodo}
                className="ml-4 py-2 px-4 text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <AddIcon className="mr-2" /> Add
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default Todo;
