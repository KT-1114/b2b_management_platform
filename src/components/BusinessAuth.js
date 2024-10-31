import React, { useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/Dhandho.png';
import Toast from '../components/Toast';

const BusinessAuth = () => {
    const [step, setStep] = useState(1);
    const [formType, setFormType] = useState('login');
    const [firstName] = useState('Jane');
    const [lastName] = useState('Smith');
    const [email] = useState('jane.smith@gmail.com');
    const [phone] = useState('2345678901');
    const [password] = useState('112233');
    const [confirmPassword] = useState('112233');
    const [businessName] = useState('Business 2');
    const [businessEmail] = useState('business2@gmail.com');
    const [businessContact] = useState('2345678901');
    const [businessSlogan] = useState('Excellence in Service');
    const [businessAddress] = useState('456 Elm St, Townsville');
    
    const { businessSignUp, signIn } = useAuth();
    const navigate = useNavigate();

    // Toast state
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const handleNext = () => {
        if (step === 1) {
            if (!firstName || !lastName || !email || !phone) {
                setToast({ show: true, message: 'Please fill out all fields.', type: 'danger' });
                return;
            }
            // if (password !== confirmPassword) {
            //     setToast({ show: true, message: 'Passwords do not match.', type: 'danger' });
            //     return;
            // }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setToast({ show: true, message: 'Please enter a valid email address.', type: 'danger' });
                return;
            }
        }

        if (step === 2) {
            if (!businessName || !businessContact || !businessEmail) {
                setToast({ show: true, message: 'Please fill out all business details.', type: 'danger' });
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(businessEmail)) {
                setToast({ show: true, message: 'Please enter a valid business email address.', type: 'danger' });
                return;
            }
        }
        setStep(step + 1);
    };

    const handlePrevious = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formType == 'login') {
            try {
                await signIn({ email, password });
            } catch (error) {
                setToast({ show: true, message: error.message, type: 'danger' });
            }
        }
        else {
            try {
                await businessSignUp({
                    firstName, lastName, email, password, phone, businessName, businessContact, businessEmail, businessSlogan, businessAddress
                });
                setToast({ show: true, message: 'Successfully signed up!', type: 'success' });
                navigate('/');
            } catch (error) {
                setToast({ show: true, message: error.message, type: 'danger' });
            }
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
                            <h2 className="text-center mb-4">{formType == 'login' ? 'Log In' : 'Sign Up'}</h2>
                            <div className="position-absolute" style={{ top: '10px', left: '10px' }}>
                                <a href='#' style={{ cursor: 'pointer' }} onClick={() => navigate('/rolePage')}>Back
                                </a>
                            </div>
                            {formType == 'login' && (
                                <>
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
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
                                                    type="password"
                                                    className="form-control"
                                                    placeholder="Password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="d-flex mb-3 justify-content-center">
                                            <button type="submit" className="btn btn-primary">
                                                Submit
                                            </button>
                                        </div>
                                    </form>
                                    <div className="d-flex mb-3 justify-content-center">
                                        <span>
                                            Don't have an account?&nbsp;
                                            <a href="#" onClick={(e) => { e.preventDefault(); setFormType('signup'); }}>
                                                Create one
                                            </a>
                                        </span>
                                    </div>
                                </>
                            )}
                            {formType == 'signup' && (<>
                                <form onSubmit={handleSubmit}>
                                    {step === 1 && (
                                        <>
                                            <div className="row">
                                                <div className="mb-3 col-6">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="First Name"
                                                        value={firstName}
                                                        onChange={(e) => setFirstName(e.target.value)}
                                                    />
                                                </div>
                                                <div className="mb-3 col-6">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Last Name"
                                                        value={lastName}
                                                        onChange={(e) => setLastName(e.target.value)}
                                                    />
                                                </div>
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
                                                    placeholder="Phone"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    placeholder="Password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    placeholder="Confirm Password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                />
                                            </div>
                                            <div className="d-flex justify-content-center">
                                                <button type="button" className="btn btn-primary" onClick={handleNext}>
                                                    Next
                                                </button>
                                            </div>
                                        </>
                                    )}
                                    {step === 2 && (
                                        <>
                                            <>
                                                <div className="mb-3">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Business Name"
                                                        value={businessName}
                                                        onChange={(e) => setBusinessName(e.target.value)}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Business Slogan"
                                                        value={businessSlogan}
                                                        onChange={(e) => setBusinessSlogan(e.target.value)}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        placeholder="Business Email"
                                                        value={businessEmail}
                                                        onChange={(e) => setBusinessEmail(e.target.value)}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Business Contact"
                                                        value={businessContact}
                                                        onChange={(e) => setBusinessContact(e.target.value)}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Business Address"
                                                        value={businessAddress}
                                                        onChange={(e) => setBusinessAddress(e.target.value)}
                                                    />
                                                </div>
                                            </>
                                            <div className="d-flex justify-content-between">
                                                <button type="button" className="btn btn-secondary" onClick={handlePrevious}>
                                                    Back
                                                </button>
                                                <button type="button" className="btn btn-primary" onClick={handleNext}>
                                                    Next
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {step === 3 && (
                                        <>
                                            <h5 className="text-center mb-4">Review Your Information</h5>
                                            <p><strong>Name:</strong> {firstName} {lastName}</p>
                                            <p><strong>Email:</strong> {email}</p>
                                            <p><strong>Phone:</strong> {phone}</p>
                                            <p><strong>Business Name:</strong> {businessName}</p>
                                            <p><strong>Business Email:</strong> {businessEmail}</p>
                                            <p><strong>Business Contact:</strong> {businessContact}</p>
                                            <div className="d-flex justify-content-between">
                                                <button type="button" className="btn btn-secondary" onClick={handlePrevious}>
                                                    Back
                                                </button>
                                                <button type="submit" className="btn btn-primary">
                                                    Submit
                                                </button>
                                            </div>
                                        </>
                                    )}
                                    <div className="d-flex mb-3 justify-content-center">
                                        <span>
                                            Already have an account?&nbsp;
                                            <a href="#" onClick={(e) => { e.preventDefault(); setFormType('login'); }}>
                                                Log In
                                            </a>
                                        </span>
                                    </div>
                                </form>
                            </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessAuth;
