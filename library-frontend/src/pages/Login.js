import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

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

// LoginForm component for username and password input
class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { username: '', password: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    alert('A user logged in: ' + this.state.username);
    this.props.onLogin(); // Call onLogin to trigger redirection
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={this.state.username}
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
        <button type="submit">Login</button>
      </form>
    );
  }
}

export default Login;
