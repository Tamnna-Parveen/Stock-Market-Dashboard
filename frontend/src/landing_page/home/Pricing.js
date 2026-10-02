import React from 'react';

function Pricing() {
    return (
        <div className="container">
            <div className="row align-items-center">

                {/* Left Section */}
                <div className="col-4">
                    <h1 className="mb-3 fs-2">Unbeatable pricing</h1>

                    <p>
                        We pioneered the concept of discount broking and
                        price transparency in India. Flat fees and no hidden charges
                    </p>

                    <a href="" style={{ textDecoration: "none" }}>
                        See Pricing
                        <i
                            className="fa fa-long-arrow-right ms-2"
                            aria-hidden="true"
                        ></i>
                    </a>
                </div>

                {/* Space */}
                <div className="col-1"></div>

                {/* Right Section */}
                <div className="col-7">
                    <div className="row">

                        {/* First ₹0 */}
                        <div className="col">
                            <div className="d-flex align-items-center">
                                <h1 className="price mb-0">
                                    <span>₹</span>0
                                </h1>

                                <p className="price-text mb-0 ms-2">
                                    Free account<br />
                                    opening
                                </p>
                            </div>
                        </div>

                        {/* Second ₹0 */}
                        <div className="col">
                            <div className="d-flex align-items-center">
                                <h1 className="price mb-0">
                                    <span>₹</span>0
                                </h1>

                                <p className="price-text mb-0 ms-2">
                                    Free equity delivery<br />
                                    and direct mutual funds
                                </p>
                            </div>
                        </div>

                        {/* Third ₹20 */}
                        <div className="col">
                            <div className="d-flex align-items-center">
                                <h1 className="price mb-0">
                                    <span>₹</span>20
                                </h1>

                                <p className="price-text mb-0 ms-2">
                                    Intraday and<br />
                                    F&O
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default Pricing;