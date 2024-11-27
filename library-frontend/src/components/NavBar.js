import React from 'react';
import { Link } from 'react-router-dom';
import '../css/NavBar.css';

const NavBar = () => {
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
        <div className="login-link">
          <Link to="/login">Register</Link>
        </div>
        <div className="login-link">
          <Link to="/register">Login</Link>
        </div>
    </nav>
  );
};

export default NavBar;
