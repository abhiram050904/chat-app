import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);  // Store token in localStorage
    setIsAuthenticated(true);  // Update authentication state
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <div data-theme="">
      <BrowserRouter>
        <Navbar onLogout={handleLogout} />
        <Routes>
          <Route path='/' element={isAuthenticated ? <Home /> : <Navigate to='/login' />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={isAuthenticated ? <Navigate to='/' /> : <Login onLogin={handleLogin} />} />
          <Route path='/settings' element={isAuthenticated ? <Settings /> : <Navigate to='/login' />} />
          <Route path='/profile' element={isAuthenticated ? <Profile /> : <Navigate to='/login' />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
