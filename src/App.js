import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import ProtectedRoute from './components/ProtectedRoute';
import AuthProvider from './components/AuthProvider';
import Home from './pages/Home';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Navbar from './components/navbar';
import SignUp from './pages/SignUp';
import RolePage from './components/RolePage';
import EmployeeAuth from './components/EmployeeAuth';
import BusinessAuth from './components/BusinessAuth';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/rolePage" element={<RolePage />} />
          <Route path="/employeeAuth" element={<EmployeeAuth />} />
          <Route path="/businessAuth" element={<BusinessAuth />} />
          <Route path="/" element={<ProtectedRoute><><Navbar /><Home /></></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><><Navbar /><Products /></></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><><Navbar /><Orders /></></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute><><Navbar /><Inventory /></></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
