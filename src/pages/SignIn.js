import React, { useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import logo from '../assets/Dhandho.png';
import Toast from '../components/Toast';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newUser, setNewUser] = useState(0);
  const { signIn } = useAuth();

  // Toast state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signIn({ email, password });
      console.log('password', password)
    } catch (error) {
      setToast({ show: true, message: error.message, type: 'danger' });
    }
  };

  const closeToast = () => setToast({ ...toast, show: false });

  return (
    <div className="auth-page">
      {/* Toast Component */}
      <Toast {...toast} onClose={closeToast} />

      <div className="container vh-100 d-flex align-items-center justify-content-center">
        <div className="row w-100">
          <div className="col-lg-3"></div>
          <div className="col-lg-6 d-flex align-items-center justify-content-center">
            <div className="col-lg-8 p-5 form-2-wrapper border shadow-lg">
              <div className="logo text-center pt-5 mb-4">
                <img src={logo} height={'75px'} alt="Logo" />
              </div>
              <h2 className="text-center mb-4">Log In</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter Your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="d-flex mb-3 justify-content-center">
                  <button type="submit" className="btn btn-primary w-50">
                    Log In
                  </button>
                </div>
                <div className="d-flex mb-3 justify-content-center">
                  <button className="btn">
                    Don’t have an account?
                    <a href="/signUp" style={{ color: 'blue', textDecoration: 'underline' }}>
                      Create one
                    </a>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
