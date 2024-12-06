import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Profile.css';

const Profile = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from localStorage to log the user out
    localStorage.removeItem('token');

    console.log("User logged out");
    console.log(localStorage.getItem('token'));

    // Redirect to login page or home
    navigate('/');
    
  };

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <div className="profile-content">
        <p>Account data</p>
        <button style={{ display: 'block', textAlign: 'left', marginLeft: '0'}} onClick={handleLogout} className="logout-button">
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
