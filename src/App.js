// src/App.js
import React from 'react';
import Navbar from './components/navbar';

function App() {
  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h1>Welcome to B2B Management Platform</h1>
        <p>Select a page from the navigation bar to get started.</p>
      </div>
    </div>
  );
}

export default App;
