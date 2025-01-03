import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', error: '', showPopup: false };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.closePopup = this.closePopup.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { email, password } = this.state;

    // Check if the email and password are not empty
    if (!email || !password) {
      this.setState({ error: 'Please fill out all fields.', showPopup: true });
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

        localStorage.setItem('token', data.token); // Save the logged-in user's token in local storage
        localStorage.setItem('userRole', data.userRole);


        // If successful, handle the response
        alert('Successful login.');
        this.props.onLogin(data.userRole); // Call the login handler
      })
      .catch((error) => {
        // Catch and display the backend error message
        this.setState({ error: error.message, showPopup: true }); // Update the error state and show popup
      });
  }

  closePopup() {
    // Clear fields and hide the popup
    this.setState({ email: '', password: '', error: '', showPopup: false });
  }

  render() {
    const { onRegister } = this.props;
    const { email, password, error, showPopup } = this.state;

    return (
      <div>
        <form className="login-form" onSubmit={this.handleSubmit}>
          <label>
            Email:
            <input
              type="text"
              name="email"
              value={email}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={password}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <button className="submit-login-button" type="submit">Login</button>

          <h4>Don't have an account? <a href="#" onClick={onRegister}>Sign up</a></h4>
        </form>

        {/* Popup for error */}
        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <h3>Error</h3>
              <p>{error}</p>
              <button className="popup-close-button" onClick={this.closePopup}>
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default LoginForm;
