// src/Navbar.js
import React, { useState } from 'react';

function Navbar() {
  const [currentPage, setCurrentPage] = useState('home');

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">B2B Platform</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}>
              <a className="nav-link" href="#" onClick={() => navigateTo('home')}>Home</a>
            </li>
            <li className={`nav-item ${currentPage === 'products' ? 'active' : ''}`}>
              <a className="nav-link" href="#" onClick={() => navigateTo('products')}>Products</a>
            </li>
            <li className={`nav-item ${currentPage === 'orders' ? 'active' : ''}`}>
              <a className="nav-link" href="#" onClick={() => navigateTo('orders')}>Orders</a>
            </li>
            <li className={`nav-item ${currentPage === 'profile' ? 'active' : ''}`}>
              <a className="nav-link" href="#" onClick={() => navigateTo('profile')}>Profile</a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="container mt-4">
        {currentPage === 'home' && <h1>Home Page</h1>}
        {currentPage === 'products' && <h1>Products Page</h1>}
        {currentPage === 'orders' && <h1>Orders Page</h1>}
        {currentPage === 'profile' && <h1>Profile Page</h1>}
      </div>
    </>
  );
}

export default Navbar;
