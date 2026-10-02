import React from "react";
import "./App.css";

const apps = [
  {
    name: "Coin",
    tagline: "Invest in mutual funds directly, zero commission.",
    icon: "🪙",
  },
  {
    name: "Console",
    tagline: "Portfolio reports, tax P&L, and account statements.",
    icon: "📊",
  },
  {
    name: "Varsity",
    tagline: "Learn the markets — free modules on trading and investing.",
    icon: "📚",
  },
  {
    name: "Streak",
    tagline: "Build and backtest trading strategies without writing code.",
    icon: "⚡",
  },
  {
    name: "Sentinel",
    tagline: "Set price alerts and get notified the moment they trigger.",
    icon: "🔔",
  },
  {
    name: "Smallcase",
    tagline: "Invest in ready-made baskets of stocks built around themes.",
    icon: "🧺",
  },
];

const Apps = () => {
  return (
    <div className="apps-page">
      <div className="apps-header">
        <h1>Apps</h1>
        <p>Explore the rest of the ecosystem</p>
      </div>

      <div className="apps-grid">
        {apps.map((app) => (
          <div className="app-card" key={app.name}>
            <div className="app-icon">{app.icon}</div>
            <div className="app-info">
              <div className="app-name-row">
                <span className="app-name">{app.name}</span>
                <span className="app-badge">Coming soon</span>
              </div>
              <p className="app-tagline">{app.tagline}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Apps;
