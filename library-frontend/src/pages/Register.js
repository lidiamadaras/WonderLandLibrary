//ebbe lesz a login js logika, amik megtudom oket swappolni

import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import '../css/Login.css';
import LoginForm from '../components/LoginForm';
//import RegisterForm from '../components/RegisterForm';

//this file should be named Register.js

// Login component with redirection after login
function Login() {
  const navigate = useNavigate(); // Updated navigation method

  const handleLogin = () => {
    // Logic for actual login can go here/
    // Redirect to the main page on successful login
    navigate('/main');
    console.log('User logged in');
  };

  return (
    <div>
      <h2>Login</h2>
      <LoginForm onLogin={handleLogin} />
    </div>
  );
}

export default Login;