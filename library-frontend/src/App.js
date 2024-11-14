import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home'; // The home page
import About from './pages/About'; // The about page
import Login from './pages/Login'; // The login page
import Main from './pages/Main'; // The login page
import './App.css';



function App() {
  return (
    <Router>
      <div class="app-title">
        <h1>Wonderland Library</h1>
        <Main /> 


      </div>
    </Router>
  );
}

export default App;
