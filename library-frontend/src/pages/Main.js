import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
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
  const [token, setToken] = useState(localStorage.getItem('token'));
  const location = useLocation();
  const [sortTrigger, setSortTrigger] = useState(false);

  // Listen for changes in location to update the token
  useEffect(() => {
    setToken(localStorage.getItem('token')); // Update token when location changes
  }, [location]);

  const handleSortClick = () => {
    setSortTrigger((prev) => !prev); // Toggle state to trigger sorting
  };

  return (
    <div>
      <NavBar />
      <div className="layout-container">
        
        <div className="sidebar-left">
        <nav className="side-menu">
            <h3>Sort Options</h3>
            <button onClick={handleSortClick}>Sort Alphabetically</button>
        </nav>
        </div>

        
        <div className="main-content">
          <div className="box">
            <Routes>
              <Route path="/" element={<Home sortTrigger={sortTrigger} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/books/:id" element={<BookDetails />} />
              <Route path="/profile" element={<Profile />} />
              
            </Routes>
          </div>
        </div>

        <div className="sidebar-right">
          {token && (
            
              <nav className="side-menu">
                <ul>
                  <li>
                    <Link to="/profile">My Profile</Link>
                  </li>
                  <li>
                    <Link to="/my-loans">My Loans</Link>
                  </li>
                  <li>
                    <Link to="/my-reservals">My Reservals</Link>
                  </li>
                </ul>
              </nav>
          )}
        </div>
        
      </div>
    </div>
    
  );
}

export default Main;
