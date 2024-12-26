// src/pages/About.js
import React from 'react';
import '../css/About.css';

function About() {
  return (
    <div className="about-container"> 
      <h1>About Us</h1>
      <p>
        Thank you for visiting our library's website! We are so happy to have you here. 
        Explore all the books our library has to offer, and make sure to borrow the book 
        that catches your interest. 
      </p>
      <p>
        Founded in 1879, our library takes pride in holding a large collection of books 
        from all over the world. Support us in our mission to make literature 
        accessible to everyone. 
      </p>
      <p>Happy reading!</p>

      <img src= "/images/alice.png" alt="Alice at table" />
    </div>
  );
}

export default About;
