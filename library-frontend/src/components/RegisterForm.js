import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      firstName: '', // Initialize firstName
      lastName: '',  // Initialize lastName
      email: '',     // Initialize email
      password: '',  // Initialize password
      error: ''      // Initialize error state

    };
    

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { firstName, lastName, email, password } = this.state;

    // Check if the email and password are not empty
    if (!firstName || !lastName || !email || !password) {
        this.setState({ error: 'Please fill out all fields.' });
        return;
      }

    // Call the API to register the user
    fetch('/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error registering user');
        }
        return response.json();
      })
      .then((data) => {
        // Handle successful registration
        console.log('User registered:', data);
        alert('Registration successful! You can now log in.');

        // Redirect to login page or another page
        //this.props.onRegisterSuccess(); // You can handle this redirection in the parent component
        this.props.onRegister(); 
      })
      .catch((error) => {
        // Handle errors during registration
        console.error('Error:', error);
        this.setState({ error: 'Failed to register user. Please try again.' });
      });
  }

  render() {
    return (
      <form className="register-form" onSubmit={this.handleSubmit}>
        <label>
            First Name:
            <input
              type="text"
              name="firstName"
              value={this.state.firstName}
              onChange={this.handleChange}
              required
            />
          </label>
          <br />
          <label>
            Last Name:
            <input
              type="text"
              name="lastName"
              value={this.state.lastName}
              onChange={this.handleChange}
              required
            />
          </label>
          <br />
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
              required
            />
          </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
        </label>
        <br />
        <button className="submit-register-button" type="submit">Register</button>
      </form>
    );
  }
}

export default RegisterForm;
