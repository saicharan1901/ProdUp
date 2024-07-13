import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { toast } from 'react-toastify';

const Sidebar = ({ user, folders, setFolders }) => {
    const [newFolderName, setNewFolderName] = useState('');
    const [selectedFolder, setSelectedFolder] = useState('All');

    useEffect(() => {
        if (user && user.uid) {
            fetchFolders(user.uid);
        }
    }, [user]);

    const fetchFolders = async (userId) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/getfolders/${userId}`);
            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Failed to fetch folders');
            }
            const result = await response.json();
            setFolders(result.folders || []);
        } catch (error) {
            console.error('Error fetching folders:', error);
            toast.error('Failed to fetch folders');
        }
    };

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

    return (
        <div className='lg:w-1/4 hidden lg:block h-full bg-gray-900 overflow-hidden '>
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
        </div>
    );
};

export default Sidebar;
