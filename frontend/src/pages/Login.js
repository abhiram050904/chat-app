import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';  
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../images/logo.png';

const Login = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post('http://localhost:5000/api/user/login', formData);
      if (data.success) {
        toast.success(data.message);
        onLogin(data.token);  // Update parent component with token
        navigate('/'); // Navigate to home page after login
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className='min-h-screen grid lg:grid-cols-2 bg-gray-50'>
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>
          <div className='text-center mb-8'>
            <div className='flex flex-col items-center gap-2 group'>
              <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                <img src={logo} className='size-6 text-primary' alt="Logo" />
              </div>
              <h1 className='text-3xl font-bold text-gray-800 mt-2'>Login</h1>
              <p className='text-base-content/60'>Welcome back to your Account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className="flex items-center border border-gray-300 rounded-md shadow-sm group hover:ring-2 hover:ring-primary focus:outline-none">
              <FaEnvelope className="ml-3 text-gray-500 group-focus:text-primary group-hover:text-primary" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border-0 focus:outline-none focus:ring-0 focus:border-none focus:ring-primary focus:border-primary rounded-md"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="flex items-center border border-gray-300 rounded-md shadow-sm group hover:ring-2 hover:ring-primary focus:outline-none">
              <FaLock className="ml-3 text-gray-500 group-focus:text-primary group-hover:text-primary" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border-0 focus:outline-none focus:ring-0 focus:ring-primary focus:border-primary rounded-md"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="ml-2 text-primary group-hover:text-primary"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary transition duration-200 ease-in-out"
              >
                Login
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/register" className="text-primary font-semibold hover:underline">
                Create Account
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className='hidden lg:block bg-gray-100 rounded-l-xl shadow-lg'>
        {/* Optional Image or Illustration */}
      </div>
    </div>
  );
};

export default Login;
