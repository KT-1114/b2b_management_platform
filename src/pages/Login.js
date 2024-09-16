import React, { useState } from 'react';
import { useAuth } from '../components/AuthProvider';

const Login = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    await signIn({ email, phone, password });
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)}/>
      <input type="text" placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)}/>
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
      <button type="submit">Log In</button>
    </form>
  );
};

export default Login;
