import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import NavBar from '../components/NavBar';
import About from './About';
import Login from './Login';
import Register from './Register';
import '../css/NavBar.css';
import '../css/Main.css';
import BookDetails from './BookDetails';
import Profile from './Profile';

function Main() {
  return (
    <div>
      <NavBar />
      <div className="layout-container">
        
        <div className="sidebar-left">
          
        </div>

        
        <div className="main-content">
          <div className="box">
            <Routes>
              <Route path="/" element={<Home />} index />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/books/:id" element={<BookDetails />} />
              <Route path="/profile" element={<Profile />} />
              
            </Routes>
          </div>
        </div>

        
        <div className="sidebar-right">
          
        </div>
      </div>
    </div>
    
  );
}

export default Main;
