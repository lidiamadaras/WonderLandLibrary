import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// CHANGE when login api is implemented

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { email, password } = this.state;

    // Check if the email and password are not empty
    if (!email || !password) {
        this.setState({ error: 'Please fill out all fields.' });
        return;
      }

    // Call the API to register the user
    fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then(async (response) => {
        // Parse the response as JSON
        const data = await response.json();
    
        if (!response.ok) {
          // If the response status is not OK, throw an error with the backend message
          throw new Error(data.error || 'An unknown error occurred.');
        }


        localStorage.setItem('token', data.token);     //i am saving the logged in user's token in local storage
    
        // If successful, handle the response
        //console.log('User logged in:', data.token);
        alert('Successful login.');
        this.props.onLogin(); // Call the login handler
      })
      .catch((error) => {
        // Catch and display the backend error message
        console.error('Error:', error);
        this.setState({ error: error.message }); // Update the error state with the backend message
      });
    
  }

  render() {
    const { onRegister } = this.props;
    return (
      <form className="login-form" onSubmit={this.handleSubmit}>
        <label>
          Email:
          <input
            type="text"
            name="email"
            value={this.state.email}
            onChange={this.handleChange}
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
        <button className="submit-login-button" type="submit">Login</button>

        <h4>Don't have an account? <a href="#" onClick={onRegister}>Sign up</a></h4>




      </form>
      
    );
  }
}

export default LoginForm;
