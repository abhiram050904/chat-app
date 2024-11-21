import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';

const Header = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-between bg-neutral-500 text-white px-9 py-4 shadow-lg">
      <div className="flex items-center space-x-3">
        <img
          src={logo}
          alt="Logo"
          className="w-20 h-20 rounded-full border-2 border-white"
        />
        <h1 className="text-4xl text-red-400 font-semibold tracking-wide">ABHIGRAM</h1>
      </div>

      <div>
        {token ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 hover:scale-105 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition duration-300 ease-in-out"
          >
            Logout
          </button>
        ) : (
          <div className="space-x-4">
            <Link to="/login">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition duration-300 ease-in-out">
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition duration-300 ease-in-out">
                Register
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
