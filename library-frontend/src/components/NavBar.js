import React from 'react';
import { Link } from 'react-router-dom';
import '../css/NavBar.css';

const NavBar = () => {
  const token = localStorage.getItem('token');
  return (
    <nav className="navbar">
        <ul className="main-menu">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About Us</Link>
          </li>
        </ul>

      {token && (
        <div className="profile-link">
          <Link to="/profile">
            <span role="img" aria-label="profile" className="profile-icon">👤</span>
          </Link>
        </div>
      )}

      {!token && (
        <div className="login-link">
          <Link to="/login">Login</Link>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
