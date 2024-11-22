import React, { useState, useEffect, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [uploadPhoto, setUploadPhoto] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('image', uploadPhoto);

    try {
      const { data } = await axios.post('http://localhost:5000/api/user/register', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (data?.success) {
        toast.success(data.message);
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        toast.error(data?.message || 'Registration failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const handleUploadPhoto = (e) => {
    const file = e.target.files[0];
    setUploadPhoto(file);
  };

  const handleClearUploadPhoto = () => {
    setUploadPhoto(null);
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-lg rounded-lg shadow-lg p-8 mx-auto'>
        <h3 className='text-2xl font-semibold text-center text-gray-800 mb-5'>Welcome to Chat app!</h3>

        <form className='space-y-6' onSubmit={handleSubmit}>
          <div className='flex flex-col'>
            <label htmlFor='name' className='text-sm font-medium text-gray-700'>Name :</label>
            <input
              type='text'
              id='name'
              name='name'
              placeholder='Enter your name'
              className='bg-slate-100 border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              value={formData.name}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className='flex flex-col'>
            <label htmlFor='email' className='text-sm font-medium text-gray-700'>Email :</label>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='Enter your email'
              className='bg-slate-100 border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              value={formData.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className='flex flex-col'>
            <label htmlFor='password' className='text-sm font-medium text-gray-700'>Password :</label>
            <input
              type='password'
              id='password'
              name='password'
              placeholder='Enter your password'
              className='bg-slate-100 border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              value={formData.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className='flex flex-col'>
            <label htmlFor='confirmPassword' className='text-sm font-medium text-gray-700'>Confirm Password :</label>
            <input
              type='password'
              id='confirmPassword'
              name='confirmPassword'
              placeholder='Confirm your password'
              className='bg-slate-100 border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              value={formData.confirmPassword}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className='flex flex-col'>
            <label htmlFor='profile_pic' className='text-sm font-medium text-gray-700'>
              Photo :
            </label>
            <div className='h-14 bg-slate-200 border border-gray-300 rounded-lg flex items-center justify-between px-4 cursor-pointer' onClick={handleFileInputClick}>
              <p className='text-sm text-gray-700 truncate'>
                {uploadPhoto?.name || "Upload profile photo"}
              </p>
              {uploadPhoto && (
                <button
                  type='button'
                  className='text-lg text-red-600 hover:text-red-700'
                  onClick={handleClearUploadPhoto}
                >
                  <IoClose />
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type='file'
              id='profile_pic'
              name='profile_pic'
              className='hidden'
              onChange={handleUploadPhoto}
            />
          </div>

          <button
            type='submit'
            className='w-full bg-blue-500 text-lg text-white font-bold py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
          >
            Register
          </button>
        </form>

        <p className='my-3 text-center'>
          Already have an account?{' '}
          <Link to='/login' className='font-semibold text-blue-500 hover:text-blue-600'>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
