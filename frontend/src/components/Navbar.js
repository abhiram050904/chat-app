import React from 'react';
import { FaUser, FaCog, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
  const token = localStorage.getItem('token');

  return (
    <nav className="bg-white p-4 shadow-md">
      <div className="flex justify-between items-center">
        <div className="text-gray-800 text-2xl">
          <Link to="/">Logo</Link>
        </div>
        <div className="flex space-x-6">
          {token ? (
            <>
              <Link
                to="/profile"
                className="text-green-600 hover:text-green-700 flex items-center gap-3 font-semibold text-lg transition-all duration-300 ease-in-out transform hover:scale-125 hover:rotate-6 hover:shadow-lg"
              >
                <FaUser className="transition-all duration-300 ease-in-out transform hover:scale-150" /> Profile
              </Link>

              <Link
                to="/settings"
                className="text-gray-600 hover:text-gray-700 flex items-center gap-3 font-semibold text-lg transition-all duration-300 ease-in-out transform hover:scale-125 hover:rotate-6 hover:shadow-lg"
              >
                <FaCog className="transition-all duration-300 ease-in-out transform hover:scale-150" /> Settings
              </Link>

              <button
                onClick={onLogout}
                className="text-red-600 hover:text-red-700 flex items-center gap-3 font-semibold text-lg transition-all duration-300 ease-in-out transform hover:scale-125 hover:rotate-6 hover:shadow-lg"
              >
                <FaSignOutAlt className="transition-all duration-300 ease-in-out transform hover:scale-150" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-green-600 hover:text-green-700 flex items-center gap-3 font-semibold text-lg transition-all duration-300 ease-in-out transform hover:scale-125 hover:rotate-6 hover:shadow-lg"
              >
                <FaSignInAlt className="transition-all duration-300 ease-in-out transform hover:scale-150" /> Login
              </Link>

              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 flex items-center gap-3 font-semibold text-lg transition-all duration-300 ease-in-out transform hover:scale-125 hover:rotate-6 hover:shadow-lg"
              >
                <FaUserPlus className="transition-all duration-300 ease-in-out transform hover:scale-150" /> Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
