import React from "react";

function CreateTicket() {
  return (
    <div>
      {/* Latest Updates */}
      <div
        style={{
          backgroundColor: "#fff4e5",
          borderLeft: "6px solid #ff8c00",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <ul className="mb-0">
          <li className="mb-3">
            <a
              href="/"
              style={{
                color: "#387ed1",
              }}
            >
              Latest intraday leverages and square-off timings
            </a>
          </li>

          <li>
            <a
              href="/"
              style={{
                color: "#387ed1",
              }}
            >
              Adjustment of F&O contracts due to dividend
            </a>
          </li>
        </ul>
      </div>

      {/* Quick Links */}
      <div
        style={{
          border: "1px solid #eee",
        }}
      >
        <div
          style={{
            backgroundColor: "#f5f5f5",
            padding: "18px",
            fontSize: "17px",
            fontWeight: "500",
          }}
        >
          Quick links
        </div>

        {[
          "Track account opening",
          "Track segment activation",
          "Intraday margins",
          "Kite user manual",
          "Learn how to create a ticket",
        ].map((link, index) => (
          <div
            key={index}
            style={{
              padding: "16px 20px",
              borderTop: "1px solid #eee",
            }}
          >
            <a
              href="/"
              style={{
                color: "#387ed1",
                textDecoration: "none",
              }}
            >
              {index + 1}. {link}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CreateTicket;
