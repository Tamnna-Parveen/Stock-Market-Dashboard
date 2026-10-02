// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./Orders.css";

// const Orders = () => {
//   const [activeTab, setActiveTab] = useState("executed");
//   const [allOrders, setAllOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [cancellingId, setCancellingId] = useState(null); // ✅ track which order is being cancelled

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get("http://localhost:3002/allOrders");
//       setAllOrders(res.data || []);
//     } catch (error) {
//       console.error("Orders fetch karne me error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Naya function: Open/pending order cancel karne ke liye
//   const handleCancelOrder = async (orderId) => {
//     try {
//       setCancellingId(orderId);
//       await axios.delete(`http://localhost:3002/cancelOrder/${orderId}`);
//       // Cancel hone ke baad list se turant hata do (ya poora refetch kar lo)
//       setAllOrders((prev) => prev.filter((order) => order._id !== orderId));
//     } catch (error) {
//       console.error("Order cancel karne me error:", error);
//       alert(error.response?.data?.message || "Order cancel nahi ho paya");
//     } finally {
//       setCancellingId(null);
//     }
//   };

//   const handleGetStarted = () => {
//     const searchInput =
//       document.getElementById("search") ||
//       document.querySelector(".search-container input");

//     if (searchInput) {
//       searchInput.focus();
//       searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
//     }
//   };

//   const filteredOrders = allOrders.filter((order) => {
//     if (activeTab === "open") return order.status === "OPEN";
//     if (activeTab === "executed") return order.status !== "OPEN";
//     return true;
//   });

//   return (
//     <div className="orders-container">
//       {/* Top Sub-tabs */}
//       <div className="orders-tabs">
//         <button
//           className={`tab-btn ${activeTab === "executed" ? "active" : ""}`}
//           onClick={() => setActiveTab("executed")}
//         >
//           Executed ({allOrders.filter((o) => o.status !== "OPEN").length})
//         </button>
//         <button
//           className={`tab-btn ${activeTab === "open" ? "active" : ""}`}
//           onClick={() => setActiveTab("open")}
//         >
//           Open ({allOrders.filter((o) => o.status === "OPEN").length})
//         </button>
//         <button
//           className={`tab-btn ${activeTab === "gtt" ? "active" : ""}`}
//           onClick={() => setActiveTab("gtt")}
//         >
//           GTT
//         </button>
//       </div>

//       {/* Main Content Area */}
//       <div className="orders-content">
//         {loading ? (
//           <div className="loading-state">Loading orders...</div>
//         ) : filteredOrders.length === 0 ? (
//           <div className="empty-orders">
//             <p>You haven't placed any orders today</p>
//             <button className="btn-get-started" onClick={handleGetStarted}>
//               Get started
//             </button>
//           </div>
//         ) : (
//           <div className="table-wrapper">
//             <table className="orders-table">
//               <thead>
//                 <tr>
//                   <th>Time</th>
//                   <th>Type</th>
//                   <th>Instrument</th>
//                   <th>Product</th>
//                   <th>Qty.</th>
//                   <th>Price</th>
//                   <th>Status</th>
//                   {activeTab === "open" && <th>Action</th>} {/* ✅ sirf Open tab mein dikhega */}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredOrders.map((order) => (
//                   <tr key={order._id}>
//                     <td>{new Date(order.createdAt).toLocaleTimeString()}</td>
//                     <td>
//                       <span className={`badge-mode ${order.mode?.toLowerCase()}`}>
//                         {order.mode}
//                       </span>
//                     </td>
//                     <td className="instrument-col">{order.name}</td>
//                     <td>{order.product}</td>
//                     <td>{order.qty}</td>
//                     <td>₹{order.price === 0 ? "MARKET" : order.price}</td>
//                     <td>
//                       <span className={`status-tag ${order.status?.toLowerCase() || "complete"}`}>
//                         {order.status || "COMPLETE"}
//                       </span>
//                     </td>
//                     {activeTab === "open" && (
//                       <td>
//                         <button
//                           className="btn-cancel-order"
//                           disabled={cancellingId === order._id}
//                           onClick={() => handleCancelOrder(order._id)}
//                         >
//                           {cancellingId === order._id ? "Cancelling..." : "Cancel"}
//                         </button>
//                       </td>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Orders;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Orders.css";

const Orders = () => {
  const [activeTab, setActiveTab] = useState("executed");
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  // ✅ GTT ke liye naye states
  const [gttOrders, setGttOrders] = useState([]);
  const [gttLoading, setGttLoading] = useState(false);
  const [showGttForm, setShowGttForm] = useState(false);
  const [checkingGtt, setCheckingGtt] = useState(false);
  const [gttForm, setGttForm] = useState({
    name: "",
    mode: "BUY",
    qty: 1,
    triggerPrice: "",
    orderPrice: "",
    product: "CNC",
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (activeTab === "gtt") {
      fetchGtt();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3002/allOrders");
      setAllOrders(res.data || []);
    } catch (error) {
      console.error("Orders fetch karne me error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ GTT list fetch karo
  const fetchGtt = async () => {
    try {
      setGttLoading(true);
      const res = await axios.get("http://localhost:3002/allGtt");
      setGttOrders(res.data || []);
    } catch (error) {
      console.error("GTT fetch karne me error:", error);
    } finally {
      setGttLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      setCancellingId(orderId);
      await axios.delete(`http://localhost:3002/cancelOrder/${orderId}`);
      setAllOrders((prev) => prev.filter((order) => order._id !== orderId));
    } catch (error) {
      console.error("Order cancel karne me error:", error);
      alert(error.response?.data?.message || "Order cancel nahi ho paya");
    } finally {
      setCancellingId(null);
    }
  };

  // ✅ Naya GTT create karo
  const handleCreateGtt = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3002/newGtt", {
        name: gttForm.name.toUpperCase(),
        mode: gttForm.mode,
        qty: Number(gttForm.qty),
        triggerPrice: Number(gttForm.triggerPrice),
        orderPrice: Number(gttForm.orderPrice),
        product: gttForm.product,
      });

      setGttForm({
        name: "",
        mode: "BUY",
        qty: 1,
        triggerPrice: "",
        orderPrice: "",
        product: "CNC",
      });
      setShowGttForm(false);
      fetchGtt();
    } catch (error) {
      console.error("GTT create karne me error:", error);
      alert("GTT create nahi ho paya");
    }
  };

  // ✅ Active GTT cancel karo
  const handleCancelGtt = async (gttId) => {
    try {
      await axios.delete(`http://localhost:3002/deleteGtt/${gttId}`);
      setGttOrders((prev) => prev.filter((g) => g._id !== gttId));
    } catch (error) {
      console.error("GTT cancel karne me error:", error);
      alert(error.response?.data?.message || "GTT cancel nahi ho paya");
    }
  };

  // ✅ Manual trigger check karo
  const handleCheckGtt = async () => {
    try {
      setCheckingGtt(true);
      const res = await axios.get("http://localhost:3002/checkGtt");
      alert(res.data.message);
      fetchGtt();
      fetchOrders(); // agar koi GTT trigger hua ho to Orders bhi refresh ho jayein
    } catch (error) {
      console.error("GTT check karne me error:", error);
      alert("GTT check nahi ho paya");
    } finally {
      setCheckingGtt(false);
    }
  };

  const handleGttFormChange = (field, value) => {
    setGttForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleGetStarted = () => {
    const searchInput =
      document.getElementById("search") ||
      document.querySelector(".search-container input");

    if (searchInput) {
      searchInput.focus();
      searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const filteredOrders = allOrders.filter((order) => {
    if (activeTab === "open") return order.status === "OPEN";
    if (activeTab === "executed") return order.status !== "OPEN";
    return true;
  });

  return (
    <div className="orders-container">
      {/* Top Sub-tabs */}
      <div className="orders-tabs">
        <button
          className={`tab-btn ${activeTab === "executed" ? "active" : ""}`}
          onClick={() => setActiveTab("executed")}
        >
          Executed ({allOrders.filter((o) => o.status !== "OPEN").length})
        </button>
        <button
          className={`tab-btn ${activeTab === "open" ? "active" : ""}`}
          onClick={() => setActiveTab("open")}
        >
          Open ({allOrders.filter((o) => o.status === "OPEN").length})
        </button>
        <button
          className={`tab-btn ${activeTab === "gtt" ? "active" : ""}`}
          onClick={() => setActiveTab("gtt")}
        >
          GTT ({gttOrders.filter((g) => g.status === "ACTIVE").length})
        </button>
      </div>

      {/* Main Content Area */}
      <div className="orders-content">
        {activeTab === "gtt" ? (
          <>
            {/* GTT ke upar ke action buttons */}
            <div className="gtt-actions">
              <button
                className="btn-get-started"
                onClick={() => setShowGttForm((prev) => !prev)}
              >
                {showGttForm ? "Cancel" : "+ Create GTT"}
              </button>
              <button
                className="btn-cancel-order"
                onClick={handleCheckGtt}
                disabled={checkingGtt}
              >
                {checkingGtt ? "Checking..." : "Check Triggers"}
              </button>
            </div>

            {/* Naya GTT banane ka form */}
            {showGttForm && (
              <form className="gtt-form" onSubmit={handleCreateGtt}>
                <div className="input-group">
                  <div className="input-box">
                    <label>Instrument</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. INFY"
                      value={gttForm.name}
                      onChange={(e) => handleGttFormChange("name", e.target.value)}
                    />
                  </div>
                  <div className="input-box">
                    <label>Mode</label>
                    <select
                      value={gttForm.mode}
                      onChange={(e) => handleGttFormChange("mode", e.target.value)}
                    >
                      <option value="BUY">BUY</option>
                      <option value="SELL">SELL</option>
                    </select>
                  </div>
                  <div className="input-box">
                    <label>Qty.</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={gttForm.qty}
                      onChange={(e) => handleGttFormChange("qty", e.target.value)}
                    />
                  </div>
                </div>
                <div className="input-group">
                  <div className="input-box">
                    <label>Trigger Price</label>
                    <input
                      type="number"
                      step="0.05"
                      required
                      placeholder="Jab price yaha pahunche"
                      value={gttForm.triggerPrice}
                      onChange={(e) => handleGttFormChange("triggerPrice", e.target.value)}
                    />
                  </div>
                  <div className="input-box">
                    <label>Order Price</label>
                    <input
                      type="number"
                      step="0.05"
                      required
                      placeholder="Trigger hone par is price par order"
                      value={gttForm.orderPrice}
                      onChange={(e) => handleGttFormChange("orderPrice", e.target.value)}
                    />
                  </div>
                  <div className="input-box">
                    <label>Product</label>
                    <select
                      value={gttForm.product}
                      onChange={(e) => handleGttFormChange("product", e.target.value)}
                    >
                      <option value="CNC">CNC</option>
                      <option value="MIS">MIS</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn-buy">
                  Create GTT
                </button>
              </form>
            )}

            {/* GTT list */}
            {gttLoading ? (
              <div className="loading-state">Loading GTT orders...</div>
            ) : gttOrders.length === 0 ? (
              <div className="empty-orders">
                <p>Koi GTT order abhi tak nahi bana</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Created</th>
                      <th>Type</th>
                      <th>Instrument</th>
                      <th>Product</th>
                      <th>Qty.</th>
                      <th>Trigger Price</th>
                      <th>Order Price</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gttOrders.map((gtt) => (
                      <tr key={gtt._id}>
                        <td>{new Date(gtt.createdAt).toLocaleTimeString()}</td>
                        <td>
                          <span className={`badge-mode ${gtt.mode?.toLowerCase()}`}>
                            {gtt.mode}
                          </span>
                        </td>
                        <td className="instrument-col">{gtt.name}</td>
                        <td>{gtt.product}</td>
                        <td>{gtt.qty}</td>
                        <td>₹{gtt.triggerPrice}</td>
                        <td>₹{gtt.orderPrice}</td>
                        <td>
                          <span className={`status-tag ${gtt.status?.toLowerCase()}`}>
                            {gtt.status}
                          </span>
                        </td>
                        <td>
                          {gtt.status === "ACTIVE" && (
                            <button
                              className="btn-cancel-order"
                              onClick={() => handleCancelGtt(gtt._id)}
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : loading ? (
          <div className="loading-state">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-orders">
            <p>You haven't placed any orders today</p>
            <button className="btn-get-started" onClick={handleGetStarted}>
              Get started
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Type</th>
                  <th>Instrument</th>
                  <th>Product</th>
                  <th>Qty.</th>
                  <th>Price</th>
                  <th>Status</th>
                  {activeTab === "open" && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleTimeString()
                        : "-"}
                    </td>
                    <td>
                      <span className={`badge-mode ${order.mode?.toLowerCase()}`}>
                        {order.mode}
                      </span>
                    </td>
                    <td className="instrument-col">{order.name}</td>
                    <td>{order.product || "-"}</td>
                    <td>{order.qty}</td>
                    <td>₹{order.price === 0 ? "MARKET" : order.price}</td>
                    <td>
                      <span className={`status-tag ${order.status?.toLowerCase() || "complete"}`}>
                        {order.status || "COMPLETE"}
                      </span>
                    </td>
                    {activeTab === "open" && (
                      <td>
                        <button
                          className="btn-cancel-order"
                          disabled={cancellingId === order._id}
                          onClick={() => handleCancelOrder(order._id)}
                        >
                          {cancellingId === order._id ? "Cancelling..." : "Cancel"}
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
