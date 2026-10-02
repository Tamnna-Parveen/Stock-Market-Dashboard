import React, { useState } from 'react';
import './signup.css';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3002/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        // Agar email already registered hai, to login try karo
        if (data.message && data.message.toLowerCase().includes('registered')) {
          const loginRes = await fetch('http://localhost:3002/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });

          const loginData = await loginRes.json();

          if (loginRes.ok) {
            localStorage.setItem('token', loginData.token);
            const userParam = encodeURIComponent(JSON.stringify(data.user));
            window.location.href = `http://localhost:3001/?token=${data.token}&user=${userParam}`;
            return;
          } else {
            alert('Email registered hai, lekin password galat hai. Login page se try karein.');
            return;
          }
        }

        alert(data.message);
        return;
      }

      localStorage.setItem('token', data.token);
      const userParam = encodeURIComponent(JSON.stringify(data.user));
      window.location.href = `http://localhost:3001/?token=${data.token}&user=${userParam}`;

    } catch (error) {
      console.error(error);
      alert('Kuch galat hua');
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <h1>Create Account</h1>
        <p className="subtitle">Sign up for a free trading account</p>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>

        <p className="login-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;