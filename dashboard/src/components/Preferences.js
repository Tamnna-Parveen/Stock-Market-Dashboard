import React, { useState } from 'react';
import './Preferences.css';

const Preferences = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);

  return (
    <div className="preferences-container">
      <div className="preferences-wrapper">
        <h2>Preferences</h2>

        <div className="pref-row">
          <div>
            <h4>Push Notifications</h4>
            <p>Order updates aur price alerts ke liye</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="pref-row">
          <div>
            <h4>Dark Mode</h4>
            <p>App ka theme dark karo</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="pref-row">
          <div>
            <h4>Email Alerts</h4>
            <p>Trade confirmations email pe bhejo</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={() => setEmailAlerts(!emailAlerts)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Preferences;