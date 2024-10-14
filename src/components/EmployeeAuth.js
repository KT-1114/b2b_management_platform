import React, { useState } from 'react';
import Toast from './Toast';
import logo from '../assets/Dhandho.png';
import { useAuth } from './AuthProvider'; // Assuming useAuth is defined in AuthContext
import { useNavigate } from 'react-router-dom';

export default function EmployeeAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [businessId, setBusinessId] = useState('');
  const [formType, setFormType] = useState('login'); // 'login', 'checkRequest', or 'signUp'
  const [isRequestApproved, setIsRequestApproved] = useState(false); // State for request approval
  const { signIn, checkRequest, employeeSignUp, newEmployeeSignUp } = useAuth();
  const navigate = useNavigate();

  // Toast state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await signIn({ email, password });
    } catch (error) {
      setToast({ show: true, message: error.message, type: 'danger' });
    }
  };

  const handleCheckRequestSubmit = async (e) => {
    e.preventDefault();
    const request = await checkRequest({ email });
    if (request.request_status === 'approved') {
      setIsRequestApproved(true);
      setFirstName(request.first_name);
      setLastName(request.last_name);
      setPhone(request.phone);
      setBusinessId(request.business_id);
    }
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setToast({ show: true, message: 'Passwords do not match.', type: 'danger' });
      return;
    }
    employeeSignUp({
      firstName, lastName, email, password, phone, businessId,
    });
  };

  const handleNewSignUpSubmit = (e) => {
    e.preventDefault();
    newEmployeeSignUp({
      firstName, lastName, email, phone, businessId
    });
  };

  const closeToast = () => setToast({ ...toast, show: false });

  return (
    <div className="auth-page">
      <Toast {...toast} onClose={closeToast} />

      <div className="container vh-100 d-flex align-items-center justify-content-center">
        <div className="row w-100">
          <div className="col-lg-3"></div>
          <div className="col-lg-6 d-flex align-items-center justify-content-center">
            <div className="col-lg-8 p-5 form-2-wrapper border shadow-lg">
              <div className="logo text-center pt-5 mb-4">
                <img src={logo} height={'75px'} alt="Logo" />
              </div>

              <h2 className="text-center mb-4">{formType === 'login' ? 'Log In' : formType === 'checkRequest' ? 'Check Request' : 'Sign Up'}</h2>

              <div className="position-absolute" style={{ top: '10px', left: '10px' }}>
                <a href='#' style={{ cursor: 'pointer' }} onClick={() => navigate('/rolePage')}>Back
                </a>
              </div>

              {formType === 'login' && (
                <form onSubmit={handleLoginSubmit}>
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
                    <span>
                      Already sent a request?&nbsp;
                      <a href="#" onClick={(e) => { e.preventDefault(); setFormType('checkRequest'); }}>
                        Check Request
                      </a>
                    </span>
                  </div>
                  <div className="d-flex mb-3 justify-content-center">
                    <span>
                      Don’t have an account?&nbsp;
                      <a href="#" onClick={(e) => { e.preventDefault(); setFormType('signUp'); }}>
                        Create one
                      </a>
                    </span>
                  </div>
                </form>
              )}

              {formType === 'checkRequest' && (
                <>
                  <form onSubmit={handleCheckRequestSubmit}>
                    <div className="mb-3">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    {!isRequestApproved && (
                      <div className="d-flex mb-3 justify-content-center">
                        <button type="submit" className="btn btn-primary w-50">
                          Check
                        </button>
                      </div>
                    )}
                  </form>
                  <form onSubmit={handleSignUpSubmit}>
                    {isRequestApproved && (
                      <>
                        <div className="mb-3">
                          <input
                            type="password"
                            className="form-control"
                            placeholder="Create Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="mb-3">
                          <input
                            type="password"
                            className="form-control"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                        <div className="d-flex mb-3 justify-content-center">
                          <button type="submit" className="btn btn-primary w-50">
                            Submit
                          </button>
                        </div>
                      </>
                    )}
                  </form>
                  <div className="d-flex mb-3 justify-content-center">
                    <span>
                      <a href="#" onClick={(e) => { e.preventDefault(); setFormType('login'); }} className="text-primary">
                        Back to Login
                      </a>
                    </span>
                  </div>
                </>
              )}

              {formType === 'signUp' && (
                <form onSubmit={handleNewSignUpSubmit}>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Business ID"
                      value={businessId}
                      onChange={(e) => setBusinessId(e.target.value)}
                    />
                  </div>
                  <div className="alert fw-light alert-secondary" role="alert">
                    NOTE: This will only send an approval request to the business having the public id you enter.
                  </div>
                  <div className="d-flex mb-3 justify-content-center">
                    <button type="submit" className="btn btn-primary w-50">
                      Sign Up
                    </button>
                  </div>
                  <div className="d-flex mb-3 justify-content-center">
                    <span>
                      <a href="#" onClick={(e) => { e.preventDefault(); setFormType('login'); }} className="text-primary">
                        Back to Login
                      </a>
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
