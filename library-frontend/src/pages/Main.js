import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import NavBar from '../components/NavBar';
import About from './About';
import Login from './Login';
import '../css/NavBar.css';

function Main() {
  return (
    <div>
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} index />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
      </Routes>
        
    </div>
    
  );
}

export default Main;
