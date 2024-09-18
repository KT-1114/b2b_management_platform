import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Dhandho.png';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);  // Toggle between login and signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && password !== confirmPassword) {
      alert("Passwords do not match!"); // Password mismatch alert
      return;
    }
    if (isLogin) {
      await signIn({ email, password });
    } else {
      await signUp({ email, password, firstName, lastName });
    }
    navigate("/");
  };

  // Toggle between Login and Sign Up
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setConfirmPassword(''); // Clear confirm password on toggle
  };

  return (
    <div className="auth-page">
      <div className="container vh-100 d-flex align-items-center justify-content-center">
        <div className="row w-100">
          {/* <!-- Left Blank Side --> */}
          <div className="col-lg-3"></div>

          {/* <!-- Right Side Form --> */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center">
            <div className="col-lg-8 p-5 form-2-wrapper border shadow-lg">
              <div className="logo text-center pt-5 mb-4">
                <img src={logo} height={'75px'} alt="Logo" />
              </div>
              <h2 className="text-center mb-4">{isLogin ? 'Log In' : 'Sign Up'}</h2>
              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className='row'>
                    <div className="mb-3 col-6">
                      <input type="text" className="form-control" placeholder="Enter First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="mb-3 col-6">
                      <input type="text" className="form-control" placeholder="Enter Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                  </div>
                )}
                <div className="mb-3">
                  <input type="email" className="form-control" placeholder="Enter Your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                  <input type="password" className="form-control" placeholder="Enter Your Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                {!isLogin && (
                  <div className="mb-3">
                    <input type="password" className="form-control" placeholder="Confirm Your Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </div>
                )}
                <div className='d-flex mb-3 justify-content-center'>
                  <button type="submit" className="btn btn-primary w-50">
                    {isLogin ? 'Log In' : 'Sign Up'}
                  </button>
                </div>
                <div className='d-flex mb-3 justify-content-center'>
                  <button className='btn'>
                    {isLogin
                      ? "Don't have an account? "
                      : 'Already have an account? '}
                    <a href="#" onClick={toggleAuthMode} style={{ color: 'blue', textDecoration: 'underline' }}>
                      {isLogin ? 'Create one' : 'Log in'}
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

export default AuthPage;
