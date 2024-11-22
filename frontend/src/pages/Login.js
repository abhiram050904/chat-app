import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PiUserCircle } from "react-icons/pi";

const Login = ({ onLogin }) => {  // Accept the onLogin prop
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordFieldVisible, setIsPasswordFieldVisible] = useState(false);
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `http://localhost:5000/api/user/check-email`;

    try {
      const response = await axios.post(URL, { email: data.email });

      if (response.data.success) {
        setIsEmailValid(true);
        toast.success('Valid email');
        setIsPasswordFieldVisible(true);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error validating email");
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `http://localhost:5000/api/user/login`;

    try {
      const response = await axios.post(URL, { email: data.email, password: data.password });
      console.log(response);

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);  // Save token to localStorage
        toast.success(response.data.message);

        setData({
          email: "",
          password: "",
        });

        onLogin(response.data.token);  // Update authentication state in App.js

        setTimeout(() => {
          navigate('/');
        }, 100);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error logging in");
    }
  };

  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto'>
        <div className='w-fit mx-auto mb-2'>
          <PiUserCircle size={80} />
        </div>

        <h3>Welcome to Chat app!</h3>

        {!isEmailValid ? (
          <form className='grid gap-4 mt-3' onSubmit={handleSubmitEmail}>
            <div className='flex flex-col gap-1'>
              <label htmlFor='email'>Email :</label>
              <input
                type='email'
                id='email'
                name='email'
                placeholder='Enter your email'
                className='bg-slate-100 px-2 py-1 focus:outline-primary'
                value={data.email}
                onChange={handleOnChange}
                required
              />
            </div>

            <button className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide'>
              Let's Go
            </button>
          </form>
        ) : (
          <form className='grid gap-4 mt-3' onSubmit={handleSubmitPassword}>
            <div className='flex flex-col gap-1'>
              <label htmlFor='password'>Password :</label>
              <input
                type='password'
                id='password'
                name='password'
                placeholder='Enter your password'
                className='bg-slate-100 px-2 py-1 focus:outline-primary'
                value={data.password}
                onChange={handleOnChange}
                required
              />
            </div>

            <button className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide'>
              Submit
            </button>
          </form>
        )}

        <p className='my-3 text-center'>
          New User?{' '}
          <Link to={"/register"} className='hover:text-primary font-semibold'>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
