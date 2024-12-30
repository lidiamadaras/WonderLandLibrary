import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './Home';
import NavBar from '../components/NavBar';
import About from './About';
import Login from './Login';
import Register from './Register';
import '../css/NavBar.css';
import '../css/Main.css';
import BookDetails from './BookDetails';
import Profile from './Profile';
import AdminHome from './userPages/AdminHome';
import AddBook from './userPages/AddBook';
import WishList from './userPages/WishList';
import MyReservals from './userPages/MyReservals';
import MyExtensions from './userPages/MyExtensions';
import MyLoans from './userPages/MyLoans';
import MyRecommendations from './userPages/MyRecommendations';

function Main() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const location = useLocation();
  const [sortOption, setSortOption] = useState('alphabetical');
  const [filterOption, setFilterOption] = useState('All');

  // Listen for changes in location to update the token
  useEffect(() => {
    setToken(localStorage.getItem('token')); // Update token when location changes
  }, [location]);

  const handleSortChange = (event) => {
    setSortOption(event.target.value); // Set the sort option
  };

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
  };

  return (
    <div>
      <NavBar />
      <div className="layout-container">
        
        <div className="sidebar-left">
        <div className="sort-options">
        <h3>Sort Options</h3>
        <div>
        <label>
          <input
            type="radio"
            id="alphabetical"
            name="sortOption"
            value="alphabetical"
            checked={sortOption === 'alphabetical'}
            onChange={handleSortChange}
          />
          Ascending
          </label>
        </div>
      <div>
      <label>
        <input
          type="radio"
          id="reverse"
          name="sortOption"
          value="reverse"
          checked={sortOption === 'reverse'}
          onChange={handleSortChange}
        />
        Descending
        </label>
      </div>

      <div>
        <label>
          <input
            type="radio"
            id="pageNumbersAsc"
            name="sortOption"
            value="pageNumbersAsc"
            checked={sortOption === 'pageNumbersAsc'}
            onChange={handleSortChange}
          />  
      Pages (Shortest)
        </label>
      </div>

      <div>
      <label>
            <input 
              type="radio"
              id="pageNumbers"
              name="sortOption"
              value="pageNumbers"
              checked={sortOption === 'pageNumbers'}
              onChange={handleSortChange}
            />
          Pages (Longest)
        </label>
      </div>
        </div>
      

        <div className="filter-options">
            <h3>Filters</h3>
            <div>
        <label>
            <input 
              type="radio" 
              value="All" 
              checked={filterOption === 'All'} 
              onChange={handleFilterChange}
            />
          All Books
        </label>
        <label>
          <input 
            type="radio" 
            value="Available" 
            checked={filterOption === 'Available'} 
            onChange={handleFilterChange}
          />
          Available Books
        </label>
      </div>

          </div>
        </div>


        
        <div className="main-content">
          <div className="box">
            <Routes>
              <Route path="/" element={<Home sortOption={sortOption} filterOption={filterOption} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/books/:id" element={<BookDetails />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminHome />} />
              <Route path="/add-book" element={<AddBook />} />
              <Route path="/wishlist" element={<WishList />} />
              <Route path="/my-loans" element={<MyLoans />} />
              <Route path="/my-reservals" element={<MyReservals />} />
              <Route path="/my-extensions" element={<MyExtensions />} />
              <Route path="/my-recommendations" element={<MyRecommendations />} />
              
            </Routes>
          </div>
        </div>

        <div className="sidebar-right">
          {token && (
            
              <nav className="side-menu">
                <ul>
                  <li>
                    <Link to="/wishlist">Wishlist</Link>
                  </li>
                  <li>
                    <Link to="/my-loans">My Loans</Link>
                  </li>
                  <li>
                    <Link to="/my-reservals">My Reservals</Link>
                  </li>
                  <li>
                    <Link to="/my-extensions">My Extensions</Link>
                  </li>
                  <li>
                    <Link to="/my-recommendations">My Recommendations</Link>
                  </li>
                </ul>
              </nav>
          )}
          <img  className="ai" src="/images/AIRabbit.png" alt="The White Rabbit" width="300"  height="400" />
        </div>
        
      </div>
    </div>
    
  );
}

export default Main;
