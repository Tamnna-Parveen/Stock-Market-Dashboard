import React from "react";

function Hero() {
  return (
    <div
      style={{
        backgroundColor: "#f7f7f7",
        padding: "45px 0",
        borderBottom: "1px solid #eee",
      }}
    >
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "500",
              margin: 0,
            }}
          >
            Support Portal
          </h1>

          <button
            className="btn"
            style={{
              backgroundColor: "#387ed1",
              color: "white",
              padding: "12px 20px",
              borderRadius: "4px",
              border: "none",
            }}
          >
            My tickets
          </button>
        </div>

        {/* Search Box */}
        <div
          className="d-flex align-items-center"
          style={{
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            padding: "8px 15px",
            borderRadius: "4px",
          }}
        >
          <span
            style={{
              fontSize: "20px",
              marginRight: "12px",
            }}
          >
            🔍
          </span>

          <input
            type="text"
            className="form-control border-0 shadow-none"
            placeholder="Eg: How do I open my account, How do I activate F&O..."
            style={{
              fontSize: "16px",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Hero;
