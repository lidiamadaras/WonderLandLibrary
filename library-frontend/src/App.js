import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home'; // The home page
import About from './pages/About'; // The about page
import Login from './pages/Login'; // The login page

function App() {
  return (
    <Router>
      <div>
        <h1>Welcome to the Library</h1>
        <p>This is the home page of our library website where you can explore our collection and services.</p>

        {/* Navigation Menu */}
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '1rem' }}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
