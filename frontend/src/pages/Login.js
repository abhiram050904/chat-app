import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Fix: Call useNavigate properly
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if email and password are provided
    if (!email || !password) {
      toast.error('Email and password are required');
      return;
    }

    setLoading(true);

    try {
      // Send login request to the server
      const response = await axios.post('http://localhost:5000/api/user/login', {
        email,
        password,
      });

      if (response.data.success) {
        // Handle successful login (you might want to redirect the user or save a token)
        toast.success('Login successful!');
        console.log('Login successful', response.data);
        localStorage.setItem('token', response.data.token); // Fix token key to be in quotes
        navigate('/'); // Use navigate properly
      } else {
        // Handle invalid login credentials
        toast.error('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen bg-neutral-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="bg-white p-8 rounded-xl shadow-xl w-96"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h2>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Submit Button with hover animation */}
          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full py-3 ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white font-semibold rounded-lg shadow-md transition duration-300`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Logging In...' : 'Login'}
          </motion.button>
        </form>

        {/* Back to register link */}
        <motion.div
          className="text-center mt-4"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm text-gray-600">Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Register</a></p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
