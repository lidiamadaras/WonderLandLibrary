import React from 'react';
import { Link } from 'react-router-dom';
import '../css/NavBar.css';

const NavBar = () => {
  return (
    <nav>
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '1rem' }}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About Us</Link>
        </li>
        <div className="login-link">
          <Link to="/login">Login</Link>
        </div>
      </ul>
    </nav>
  );
};

export default NavBar;
