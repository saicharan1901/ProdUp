"use client";

import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../../../components/navbar';
import { useRouter } from 'next/navigation'; // Update import if necessary
import { onAuthStateChangedListener } from '/app/firebase'; // Adjust path as necessary

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState('');
  const [tagText, setTagText] = useState('');
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
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);

    toast.error('Todo deleted!', { position: "top-right" });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center py-2">
        <ToastContainer />
        <h1 className="mx-auto justify-center items-center flex text-4xl font-bold text-yellow-700 mt-10">Todo List</h1>
        <div className="mt-6 bg-gray-800 rounded-lg shadow-lg px-8 py-6 mb-8 border-gray-600 border mx-auto hover:border-yellow-700 transition duration-300 transform hover:-translate-y-1 hover:shadow-2xl">
          <div className="mb-4">
            <label htmlFor="todo" className="block text-sm font-medium text-white font-bold">Todo</label>
            <input
              id="todo"
              type="text"
              value={todoText}
              onChange={(e) => setTodoText(e.target.value)}
              className="w-full px-3 py-2 placeholder-gray-400 rounded-lg focus:outline-none bg-gray-700 text-white transition duration-300 transform focus:ring-2 focus:ring-yellow-700"
              placeholder="Enter todo..." />
          </div>
          <div className="mb-4">
            <label htmlFor="tags" className="block text-sm font-medium text-white font-bold">Tags (comma-separated)</label>
            <input
              id="tags"
              type="text"
              value={tagText}
              onChange={(e) => setTagText(e.target.value)}
              className="w-full px-3 py-2 placeholder-gray-400 rounded-lg focus:outline-none bg-gray-700 text-white transition duration-300 transform focus:ring-2 focus:ring-yellow-700"
              placeholder="Enter tags..." />
          </div>
          <div className="mb-6">
            <button
              onClick={handleAddTodo}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Todo
            </button>
          </div>
          {todos.map(todo => (
            <div key={todo.id} className="flex items-center justify-between bg-gray-200 px-4 py-2 mb-2 rounded-md">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => handleToggleDone(todo.id)}
                  className="form-checkbox h-5 w-5 text-blue-500" />
                <p className={`ml-2 ${todo.done ? 'line-through' : ''}`}>{todo.text}</p>
              </div>
              <div>
                {todo.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 text-xs bg-blue-200 text-blue-800 rounded-full mr-1">{tag}</span>
                ))}
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 12a1 1 0 0 1-1-1V6a1 1 0 1 1 2 0v5a1 1 0 0 1-1 1zM5 4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v1H5V4z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M8 18a2 2 0 0 1-2-2h8a2 2 0 0 1-2 2H8zm5-2a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V7h6v9z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Todo;
