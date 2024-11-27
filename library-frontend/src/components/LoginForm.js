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
    alert('A user logged in: ' + this.state.email);
    this.props.onLogin(); // Call onLogin to trigger redirection
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
