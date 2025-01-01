import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import '../css/NavBar.css';

const NavBar = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
  const location = useLocation();
  const navigate = useNavigate();

  // Listen for changes in location to update the token
  useEffect(() => {
    setToken(localStorage.getItem('token')); // Update token when location changes
    setUserRole(localStorage.getItem('userRole'));
  }, [location]);

  return (
    
    <nav className="navbar">
        <ul className="main-menu">
          <li>
            <Link to={userRole === 'admin' ? '/admin' : '/'}>Home</Link>
          </li>
          <li>
            <Link to="/about">About Us</Link>
          </li>
        </ul>

      {token && (
        <div className="login-link">
          <Link to="/profile">Profile
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
