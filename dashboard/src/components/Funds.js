import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Funds.css";

const Funds = () => {
  const [funds, setFunds] = useState({
    availableMargin: 0,
    usedMargin: 0,
    availableCash: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFunds();
  }, []);

  const fetchFunds = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3002/funds");
      setFunds(res.data);
    } catch (error) {
      console.error("Error fetching funds:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (num) =>
    Number(num || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handleAddFunds = async (e) => {
    e.preventDefault();
    const amount = window.prompt("How much would you like to add?");
    if (!amount || isNaN(amount) || Number(amount) <= 0) return;

    try {
      await axios.post("http://localhost:3002/addFunds", { amount: Number(amount) });
      fetchFunds();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add funds");
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const amount = window.prompt("How much would you like to withdraw?");
    if (!amount || isNaN(amount) || Number(amount) <= 0) return;

    try {
      await axios.post("http://localhost:3002/withdrawFunds", { amount: Number(amount) });
      fetchFunds();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to withdraw funds");
    }
  };

  const usedPercent =
    funds.usedMargin > 0
      ? Math.min(100, (funds.usedMargin / (funds.usedMargin + funds.availableCash)) * 100)
      : 0;

  const detailRows = [
    { label: "Opening balance", value: funds.availableMargin },
    { label: "Payin", value: 0 },
    { label: "SPAN", value: 0 },
    { label: "Delivery margin", value: 0 },
    { label: "Exposure", value: 0 },
    { label: "Options premium", value: 0 },
  ];

  const collateralRows = [
    { label: "Collateral (Liquid funds)", value: 0 },
    { label: "Collateral (Equity)", value: 0 },
    { label: "Total collateral", value: 0 },
  ];

  return (
    <div className="funds-page">
      {/* Header */}
      <div className="funds-header">
        <div className="funds-header-text">
          <h1>Funds</h1>
          <p>Instant, zero-cost fund transfers with UPI</p>
        </div>
        <div className="funds-header-actions">
          <button className="fbtn fbtn-primary" onClick={handleAddFunds}>
            Add funds
          </button>
          <button className="fbtn fbtn-outline" onClick={handleWithdraw}>
            Withdraw
          </button>
        </div>
      </div>

      <div className="funds-grid">
        {/* Equity section */}
        <div className="funds-card funds-equity">
          <div className="funds-card-title">Equity</div>

          {/* Top 3 highlight stats */}
          <div className="funds-stats">
            <div className="funds-stat funds-stat-highlight">
              <span className="funds-stat-label">Available margin</span>
              <span className="funds-stat-value">
                {loading ? "…" : `₹${formatMoney(funds.availableMargin)}`}
              </span>
            </div>
            <div className="funds-stat">
              <span className="funds-stat-label">Used margin</span>
              <span className="funds-stat-value">
                {loading ? "…" : `₹${formatMoney(funds.usedMargin)}`}
              </span>
            </div>
            <div className="funds-stat">
              <span className="funds-stat-label">Available cash</span>
              <span className="funds-stat-value">
                {loading ? "…" : `₹${formatMoney(funds.availableCash)}`}
              </span>
            </div>
          </div>

          {/* Usage bar */}
          <div className="funds-usage-bar">
            <div className="funds-usage-fill" style={{ width: `${usedPercent}%` }} />
          </div>
          <div className="funds-usage-caption">
            {loading ? "Loading…" : `${usedPercent.toFixed(1)}% margin in use`}
          </div>

          <div className="funds-divider" />

          {/* Detail rows */}
          <div className="funds-detail-list">
            {detailRows.map((row) => (
              <div className="funds-detail-row" key={row.label}>
                <span>{row.label}</span>
                <span>{loading ? "…" : formatMoney(row.value)}</span>
              </div>
            ))}
          </div>

          <div className="funds-divider" />

          <div className="funds-detail-list">
            {collateralRows.map((row) => (
              <div className="funds-detail-row" key={row.label}>
                <span>{row.label}</span>
                <span>{formatMoney(row.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Commodity section */}
        <div className="funds-card funds-commodity">
          <div className="funds-card-title">Commodity</div>
          <div className="funds-commodity-body">
            <p className="funds-commodity-title">You don't have a commodity account</p>
            <p className="funds-commodity-subtext" >
              Open a commodity account to trade in gold, silver, crude oil, and other
              commodities on MCX.
            </p>
            <button
              className="fbtn fbtn-primary"
              onClick={(e) => {
                e.preventDefault();
                alert("Commodity trading coming soon!");
              }}
            >
              Open account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Funds;
