"use client";

import { useState, useEffect, useRef } from 'react';
import { signInWithGoogle, signOutUser, onAuthStateChangedListener } from '../components/auth'; // Adjust path as necessary


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('hh'); // Initial active link
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [user, setUser] = useState(null);

  // Function to toggle the navbar dropdown
  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  // Function to handle link click
  const handleLinkClick = (link) => {
    setActiveLink(link);
    setIsOpen(false); // Close dropdown after selecting a link
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(setUser);
    return () => unsubscribe(); // Call unsubscribe when component unmounts
  }, []);

  const handleSignIn = async () => {
    try {
      const userData = await signInWithGoogle();
      setUser(userData);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            ProdUp
          </span>
        </a>
        <button
          onClick={toggleNavbar}
          ref={buttonRef}
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-dropdown"
          aria-expanded={isOpen ? 'true' : 'false'}
        >
          <span className="sr-only">Open main menu</span>
          {isOpen ? (
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          )}
        </button>
        <div
          className={`${isOpen ? 'block' : 'hidden'
            } w-full md:block md:w-auto`}
          id="navbar-dropdown"
          ref={dropdownRef}
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <a
                href="/homeee"
                onClick={() => handleLinkClick('Home')}
                className={`block py-2 px-3 rounded md:p-0 ${activeLink === 'Home'
                  ? 'text-blue-700 dark:text-blue-500'
                  : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'
                  }`}
                aria-current={activeLink === 'Home' ? 'page' : undefined}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/dashboard"
                onClick={() => handleLinkClick('Services')}
                className={`block py-2 px-3 rounded md:p-0 ${activeLink === 'Services'
                  ? 'text-blue-700 dark:text-blue-500'
                  : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'
                  }`}
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/about"
                onClick={() => handleLinkClick('Pricing')}
                className={`block py-2 px-3 rounded md:p-0 ${activeLink === 'Pricing'
                  ? 'text-blue-700 dark:text-blue-500'
                  : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'
                  }`}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="https://github.com/saicharan1901/ProdUp"
                onClick={() => handleLinkClick('Contact')}
                className={`block py-2 px-3 rounded md:p-0 ${activeLink === 'Contact'
                  ? 'text-blue-700 dark:text-blue-500'
                  : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'
                  }`}
              >
                Contribute
              </a>
            </li>
            <li>
              {user ? (
                <div className="">
                  <button
                    className={`block py-2 px-3 rounded md:p-0 ${activeLink === 'About'
                      ? 'text-yellow-700 dark:text-yellow-500'
                      : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-yellow-700 dark:text-white md:dark:hover:text-yellow-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'
                      }`}
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  className={`block py-2 px-3 rounded md:p-0 ${activeLink === 'About'
                    ? 'text-yellow-700 dark:text-yellow-500'
                    : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-yellow-700 dark:text-white md:dark:hover:text-yellow-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'
                    }`} onClick={handleSignIn}
                >
                  Sign In with Google
                </button>
              )}
            </li>
            <li>
              {user ? (
                <img
                  src={user.photoURL}
                  alt="User Profile"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <></>
              )}

            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;