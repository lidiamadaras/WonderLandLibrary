import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import '../css/Login.css';
import LoginForm from '../components/LoginForm';

// Login component with redirection after login
function Login() {
  const navigate = useNavigate(); // Updated navigation method

  const handleLogin = () => {
    // Logic for actual login can go here
    // Redirect to the main page on successful login
    navigate('/main');
  };

  return (
    <div>
      <h2>Login Page</h2>
      <LoginForm onLogin={handleLogin} /> {/* Pass handleLogin as a prop */}
    </div>
  );
}

export default Login;