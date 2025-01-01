import React, { useState } from 'react';
import '../../css/AddBook.css';

function AddBook() {
  const [formData, setFormData] = useState({
    title: '', 
        authorFirstName: '', 
        authorLastName: '', 
        country: '', 
        publisherName: '', 
        publisherAddress: '', 
        genres: '', // Array of genres
        isbn: '', 
        publishYear: '', 
        pages: '', 
        copies: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    const { authorFirstName, authorLastName, publisherName } = formData;
    if (!authorFirstName || !authorLastName || !publisherName) {
      setErrorMessage('Please fill in all the mandatory fields.');
      return;
    }


    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User is not authenticated. Please log in.');
      }

      const response = await fetch('/api/books/add', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
         },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add book');
      }

      setSuccessMessage('Book added successfully!');
      setFormData({
        title: '', 
        authorFirstName: '', 
        authorLastName: '', 
        country: '', 
        publisherName: '', 
        publisherAddress: '', 
        genres: '', // Array of genres
        isbn: '', 
        publishYear: '', 
        pages: '', 
        copies: ''
      });
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div>
      <h1>Add a New Book</h1>
      <form onSubmit={handleSubmit}>
      <div>
          <label>Book Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Author First Name:</label>
          <input
            type="text"
            name="authorFirstName"
            value={formData.authorFirstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Author Last Name:</label>
          <input
            type="text"
            name="authorLastName"
            value={formData.authorLastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Country:</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Publisher Name:</label>
          <input
            type="text"
            name="publisherName"
            value={formData.publisherName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Publisher Address:</label>
          <input
            type="text"
            name="publisherAddress"
            value={formData.publisherAddress}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Genres (comma-separated):</label>
          <input
            type="text"
            name="genres"
            value={formData.genres}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>ISBN:</label>
          <input
            type="text"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Publish Year:</label>
          <input
            type="number"
            name="publishYear"
            value={formData.publishYear}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Pages:</label>
          <input
            type="number"
            name="pages"
            value={formData.pages}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Copies:</label>
          <input
            type="number"
            name="copies"
            value={formData.copies}
            onChange={handleChange}
          />
        </div>
        <button type="submit" style={{ padding: '8px', marginTop: '10px' }}>Add Book</button>
      </form>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default AddBook;
