import React, { useState,useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../images/logo.png';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

    // Redirect user if token exists in localStorage
    useEffect(() => {
      if (localStorage.getItem('token')) {
        navigate('/');
      }
    }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Make the API call for registration
    try {
      const { data } = await axios.post('http://localhost:5000/api/user/register', formData);
      if (data.success) {
        toast.success(data.message);
        localStorage.setItem('token', data.token);
        navigate('/');
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || 'Registration failed. Please try again.');
      } else {
        toast.error('Network error. Please check your internet connection.');
      }
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
              <h1 className='text-3xl font-bold text-gray-800 mt-2'>Create Account</h1>
              <p className='text-base-content/60'>Get started with your Account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className="flex items-center border border-gray-300 rounded-md shadow-sm group hover:ring-2 hover:ring-primary focus:outline-none">
              <FaUser className="ml-3 text-gray-500 group-focus:text-primary group-hover:text-primary" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border-0 focus:outline-none focus:ring-0 focus:border-none focus:ring-primary focus:border-primary rounded-md"
                placeholder="Enter your full name"
                required
              />
            </div>

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
                className="ml-2 text-primary group-hover:text-primary"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="flex items-center border border-gray-300 rounded-md shadow-sm group hover:ring-2 hover:ring-primary focus:outline-none">
              <FaLock className="ml-3 text-gray-500 group-focus:text-primary group-hover:text-primary" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border-0 focus:outline-none focus:ring-0 focus:ring-primary focus:border-primary rounded-md"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="ml-2 text-primary group-hover:text-primary"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary transition duration-200 ease-in-out"
              >
                Create Account
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-primary font-semibold hover:underline">
                Login
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

export default Register;
