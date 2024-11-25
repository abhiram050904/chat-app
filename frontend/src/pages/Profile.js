import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, Mail, User, Loader } from "lucide-react";
import moment from 'moment';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', email: '', profile_pic: '', createdAt: '' });
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      axios
        .post('http://localhost:5000/api/user/get-details', {}, { headers: { token } })
        .then(response => {
          setUserInfo(response.data.data);
          setName(response.data.data.name);
          console.log(response.data.data)
        })
        .catch(error => console.error(error));
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
    else setUserInfo(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSave = () => {
    setLoading(true);
    const updatedData = new FormData();
    updatedData.append("name", name);
    updatedData.append("image", image || userInfo.profile_pic);
    axios
      .post('http://localhost:5000/api/user/update-details', updatedData, {
        headers: { token, 'Content-Type': 'multipart/form-data' },
      })
      .then(() => {
        setUserInfo({ ...userInfo, name, profile_pic: image ? URL.createObjectURL(image) : userInfo.profile_pic });
        setIsEditing(false);
        setImage(null);
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  };

  const handleEdit = () => (isEditing ? handleSave() : setIsEditing(true));

  const memberSince = userInfo.createdAt ? moment(userInfo.createdAt).format('MMMM Do, YYYY') : 'N/A';

  return (
    <div className="no-scroll h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-white rounded-xl p-6 space-y-8 shadow-xl">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={image ? URL.createObjectURL(image) : userInfo.profile_pic || "/avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
              />
              {isEditing && (
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-blue-600 hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200"
                >
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </label>
              )}
            </div>
            <p className="text-sm text-gray-500">{image ? "Image updated" : "Click the camera icon to update your photo"}</p>
          </div>
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-gray-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="px-4 py-2.5 bg-gray-200 rounded-lg border">{userInfo.name}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <div className="text-sm text-gray-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-gray-200 rounded-lg border">{userInfo.email}</p>
            </div>
          </div>
          <div className="mt-6 bg-gray-100 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-gray-400">
                <span>Member Since</span>
                <span>{memberSince}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
          <div className="text-center mt-6">
            <button
              onClick={handleEdit}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {loading ? <Loader className="animate-spin w-6 h-6 text-white" /> : isEditing ? 'Save' : 'Edit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
