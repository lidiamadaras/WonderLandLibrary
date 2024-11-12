import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import NavBar from './NavBar';
import About from './About';
import Login from './Login';

function Main() {
  return (
    <div>
      <NavBar /> {/* Include NavBar here */}
      <h1>Welcome to the Library</h1>
      <p>This is the home page of our library website where you can explore our collection and services.</p>

      {/* Page Routes */}
      <Routes>
        <Route path="/" element={<Home />} /> {/* Show Home by default */}
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default Main;
