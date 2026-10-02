import React, { useState } from 'react';
import "./PlaceholderPage.css";
import "./Support.css";

const Support = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Abhi backend connected nahi hai, isliye sirf confirmation dikhao
    setSubmitted(true);
    setSubject('');
    setMessage('');
  };

  return (
    <div className="support-container">
      <div className="support-wrapper">
        <h2>Support</h2>
        <p className="support-subtitle">Hume message karo, hum jaldi reply karenge</p>

        <div className="support-faqs">
          <h4>Common Questions</h4>
          <div className="faq-item">How do I place an order?</div>
          <div className="faq-item">How do I add funds?</div>
          <div className="faq-item">How do I download my P&L statement?</div>
        </div>

        {submitted ? (
          <div className="support-success">
            ✅ Tumhara message bhej diya gaya hai! Hum jald hi contact karenge.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="support-form">
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
            <textarea
              placeholder="Apna message likho..."
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
            <button type="submit">Send Message</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Support;