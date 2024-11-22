import axios from 'axios';
import React, { useState, useEffect } from 'react';

const Home = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [name, setName] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      axios
        .post('http://localhost:5000/api/user/get-details', {}, { headers: { token } })
        .then(response => {
          setUserInfo(response.data.data);
          setName(response.data.data.name);
        })
        .catch(error => console.error(error));
    }
  }, [token]);

  return (
    <div>
      <h1>Welcome, {name}</h1>
      {userInfo && (
        <div>
          <h3>Your Info:</h3>
          <p>Email: {userInfo.email}</p>
          <p>Phone: {userInfo.phone}</p>
          {/* Display other user details as needed */}
        </div>
      )}
    </div>
  );
}

export default Home;
