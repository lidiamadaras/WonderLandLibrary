import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import '../css/Login.css';
//import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';


// Login component with redirection after login
function Register() {
  const navigate = useNavigate(); // Updated navigation method

  const handleRegister = () => {
    // Logic for actual login can go here/
    // Redirect to the main page on successful login
    navigate('/main');
    console.log('User registered');
  };

  return (
    <div>
      <h2>Login Page</h2>
      <RegisterForm onRegister={handleRegister} />
    </div>
  );
}

export default Register;