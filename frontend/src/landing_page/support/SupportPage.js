import React, { useState } from "react";

import Hero from "./Hero";
import CreateTicket from "./CreateTicket";

function SupportPage() {
  const [open, setOpen] = useState(null);

  const categories = [
    {
      title: "Account Opening",
      icon: "⊕",
      items: [
        <li>Resident individual</li>,
        <li>Minor</li>,
        <li>Non Resident Indian (NRI)</li>,
        <li>Company, Partnership, HUF and LLP</li>,
        <li>Glossary</li>
      ],
    },
    {
      title: "Your Zerodha Account",
      icon: "◎",
      items: [<li>Your Profile</li>,
              <li>Account modification</li>, 
              <li>Client Master Report (CMR) and Depository Participant (DP)</li>,
              <li>Nomination</li>,
              <li>Transfer and conversion of securities</li>
            ],
    },
    {
      title: "Kite",
      icon: "◉",
      items: [<li>IPO</li>,
              <li>Trading FAQs</li>,
              <li>Margin Trading Facility (MTF) and Margins</li>,
              <li>Charts and orders</li>,
              <li>Alerts and Nudges</li>,
              <li>General</li>
      ],
    },
    {
      title: "Funds",
      icon: "₹",
      items: [<li>Add money</li>, 
              <li>Withdraw funds</li>, 
              <li>Add bank accounts</li>,
              <li>eMandates</li>
            ],
    },
    {
      title: "Console",
      icon: "◉",
      items: [<li>Portfolio</li>, 
              <li>Corporate actions</li>,
              <li>Funds statement</li>,
              <li>Reports</li>,
              <li>Profile</li>,
              <li>Segments</li> 
            ],
    },
    {
      title: "Coin",
      icon: "◯",
      items: [<li>Mutual funds</li>, 
              <li>National Pension Schema (NPS)</li>,
              <li>Fixed Deposit (FD)</li>,
              <li>Features on Coin</li>,
              <li>Payments and Orders</li>,
              <li>General</li>
            ],
    },
  ];

  const toggleCategory = (index) => {
    setOpen(open === index ? null : index);
  };

  return (
    <>
      {/* Top Section */}
      <Hero />

      {/* Main Support Section */}
      <div className="container py-5">
        <div className="row">
          {/* LEFT SIDE */}
          <div className="col-lg-8">
            {categories.map((category, index) => (
              <div
                key={index}
                className="mb-4"
                style={{
                  border: "1px solid #e5e5e5",
                }}
              >
                {/* Category */}
                <div
                  onClick={() => toggleCategory(index)}
                  className={`support-category ${
                    open === index ? "active" : ""
                  } d-flex justify-content-between align-items-center`}
                  style={{
                    padding: "15px",
                    borderLeft: "4px solid transparent",
                  }}
                >
                  <div className="d-flex align-items-center">
                    <div
                      style={{
                        width: "55px",
                        height: "55px",
                        backgroundColor: "#f8fbff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#387ed1",
                        fontSize: "24px",
                        marginRight: "15px",
                      }}
                    >
                      {category.icon}
                    </div>

                    <span
                      style={{
                        fontSize: "17px",
                      }}
                    >
                      {category.title}
                    </span>
                  </div>

                  <span
                    style={{
                      color: "#387ed1",
                      fontSize: "20px",
                    }}
                  >
                    {open === index ? "⌃" : "⌄"}
                  </span>
                </div>

                {/* Items */}
                {open === index && (
                  <div
                    style={{
                      borderTop: "1px solid #eee",
                      padding: "15px 70px",
                      backgroundColor: "#fafafa",
                    }}
                  >
                    {category.items.map((item, i) => (
                      <p
                        key={i}
                        style={{
                          color: "#387ed1",
                          cursor: "pointer",
                        }}
                      >
                        {item}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="col-lg-4">
            <CreateTicket />
          </div>
        </div>
      </div>
    </>
  );
}

export default SupportPage;
