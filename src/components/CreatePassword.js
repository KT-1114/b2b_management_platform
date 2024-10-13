import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Toast from './Toast';
import logo from '../assets/Dhandho.png';


const CreatePassword = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { email } = location.state || {}; // Get the email from the state

	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Basic validation
		if (password !== confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		try {
			// Replace this with your sign-up logic
			await signUpUser(email, password);
			navigate('/'); // Redirect after successful sign-up
		} catch (err) {
				setToast({ show: true, type: 'danger', message: error.message });	
		}
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
							<h2 className="text-center mb-4">Create Password</h2>
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

// Mock function for sign-up logic
const signUpUser = async (email, password) => {
	// Implement your sign-up logic here (API call, etc.)
	console.log('User signed up:', { email, password });
};

export default CreatePassword;
