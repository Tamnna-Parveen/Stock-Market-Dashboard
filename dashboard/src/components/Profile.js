import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <div className="profile-container">
        <p>User data nahi mila. Please login karein.</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>

        <h2>{user.name}</h2>
        <p className="profile-email">{user.email}</p>

        <div className="profile-details">
          <div className="detail-row">
            <span className="detail-label">Full Name</span>
            <span className="detail-value">{user.name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email</span>
            <span className="detail-value">{user.email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">User ID</span>
            <span className="detail-value">{user.id}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Account Type</span>
            <span className="detail-value">Individual</span>
          </div>
        </div>

        <div className="profile-note">
          <p>KYC info aur bank account details jaldi available honge.</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;