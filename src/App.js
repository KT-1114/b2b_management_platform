import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import AuthProvider from './components/AuthProvider';
import Home from './pages/Home';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Navbar from './components/navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<ProtectedRoute><><Navbar /><Home /></></ProtectedRoute>}/>
          <Route path="/products" element={<ProtectedRoute><><Navbar /><Products /></></ProtectedRoute>}/>
          <Route path="/orders" element={<ProtectedRoute><><Navbar /><Orders /></></ProtectedRoute>}/>
          <Route path="/inventory" element={<ProtectedRoute><><Navbar /><Inventory /></></ProtectedRoute>}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
