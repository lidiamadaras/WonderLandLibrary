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

  const handleLogin = (userRole) => {

    try {
      console.log("Userrole " +  userRole)
      
      if (userRole === 'admin') {
        console.log("Userrole " +  userRole)
        navigate('/admin'); // Redirect admin to admin home page
        console.log('Admin logged in');
      } else {
        navigate('/'); // Redirect normal user to home page
        console.log('User logged in');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred while logging in. Please try again.');
    }
  };

  const handleRegister = () => {
    console.log('Redirecting to registration page');
    navigate('/register'); // Navigate to the registration page
  };

  return (
    <div>
      <h2>Login</h2>
      <LoginForm onLogin={handleLogin} onRegister={handleRegister} />
    </div>
  );
}

export default Login;