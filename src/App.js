import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AuthProvider from './components/AuthProvider';
import Home from './pages/Home';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Navbar from './components/navbar';
import RolePage from './components/RolePage';
import EmployeeAuth from './components/EmployeeAuth';
import BusinessAuth from './components/BusinessAuth';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/rolePage" element={<RolePage />} />
          <Route path="/employeeAuth" element={<EmployeeAuth />} />
          <Route path="/businessAuth" element={<BusinessAuth />} />
          <Route path="/products" element={<><Navbar /><ProtectedRoute children={<Products />} /></>} />
          <Route path="/" element={<><Navbar /><ProtectedRoute children={<Home />} /></>} />
          <Route path="/orders" element={<><Navbar /><ProtectedRoute children={<Orders />} /></>} />
          <Route path="/inventory" element={<><Navbar /><ProtectedRoute children={<Inventory />} /></>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
