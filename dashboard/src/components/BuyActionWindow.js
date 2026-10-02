import React, { useState, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [productType, setProductType] = useState("CNC");
  const [orderType, setOrderType] = useState("MARKET");

  const generalContext = useContext(GeneralContext);

  const handleBuyClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3002/newOrder", {
        name: uid,
        qty: Number(stockQuantity),
        price: orderType === "MARKET" ? 0 : Number(stockPrice),
        mode: "BUY",
        product: productType,
        orderType: orderType,
      });

      generalContext.closeBuyWindow();
    } catch (error) {
      console.error("Failed to place buy order:", error);
    }
  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    generalContext.closeBuyWindow();
  };

  return (
    <div className="modal-overlay" onClick={handleCancelClick}>
      <div className="buy-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header Bar */}
        <div className="modal-header">
          <div className="stock-title">
            <h2>Buy {uid || "STOCK"}</h2>
            <span className="badge">NSE</span>
          </div>
          <div className="ltp-info">
            LTP <span>₹140.65</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* CNC vs MIS Tabs */}
          <div className="product-tabs">
            <label className={`tab-item ${productType === "CNC" ? "active" : ""}`}>
              <input
                type="radio"
                name="buyProduct"
                checked={productType === "CNC"}
                onChange={() => setProductType("CNC")}
              />
              Longterm <span>CNC</span>
            </label>
            <label className={`tab-item ${productType === "MIS" ? "active" : ""}`}>
              <input
                type="radio"
                name="buyProduct"
                checked={productType === "MIS"}
                onChange={() => setProductType("MIS")}
              />
              Intraday <span>MIS</span>
            </label>
          </div>

          {/* Qty & Price Input Row */}
          <div className="input-group">
            <div className="input-box">
              <label>Qty.</label>
              <input
                type="number"
                min="1"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
              />
            </div>
            <div className="input-box">
              <label>Price</label>
              <input
                type="number"
                step="0.05"
                disabled={orderType === "MARKET"}
                value={stockPrice}
                onChange={(e) => setStockPrice(e.target.value)}
                placeholder={orderType === "MARKET" ? "At Market" : "0.00"}
              />
            </div>
          </div>

          {/* Order Type Radio Selection */}
          <div className="order-types">
            {["MARKET", "LIMIT", "SL", "SL-M"].map((type) => (
              <label key={type} className={`type-pill ${orderType === type ? "active" : ""}`}>
                <input
                  type="radio"
                  name="buyOrderType"
                  value={type}
                  checked={orderType === type}
                  onChange={() => setOrderType(type)}
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Footer Bar */}
        <div className="modal-footer">
          <div className="margin-info">
            Margin required: <strong>₹{(stockQuantity * (orderType === "MARKET" ? 140.65 : stockPrice || 0)).toFixed(2)}</strong>
          </div>
          <div className="action-btns">
            <button className="btn-buy" onClick={handleBuyClick}>
              Buy
            </button>
            <button className="btn-cancel" onClick={handleCancelClick}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;