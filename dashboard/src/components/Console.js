import React from 'react';
import './Console.css';

const Console = () => {
  return (
    <div className="console-container">
      <div className="console-header">
        <h2>Console</h2>
        <p>Reports, statements aur account analytics yahan milenge</p>
      </div>

      <div className="console-grid">
        <div className="console-card">
          <h3>P&L Statement</h3>
          <p>Apna profit/loss report dekho date range ke hisaab se</p>
        </div>
        <div className="console-card">
          <h3>Tax P&L</h3>
          <p>Tax filing ke liye capital gains report</p>
        </div>
        <div className="console-card">
          <h3>Holdings Statement</h3>
          <p>Apni current holdings ka detailed breakdown</p>
        </div>
        <div className="console-card">
          <h3>Ledger</h3>
          <p>Saari fund transactions ki history</p>
        </div>
      </div>
    </div>
  );
};

export default Console;