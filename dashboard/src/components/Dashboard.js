import React from "react";
import { Route, Routes } from "react-router-dom";

import Apps from "./Apps";
import Funds from "./Funds";
import Holdings from "./Holdings";

import Orders from "./Orders";
import Positions from "./Positions";
import Summary from "./Summary";
import WatchList from "./WatchList";
import { GeneralContextProvider } from "./GeneralContext";

// ✅ Naye placeholder pages
import Profile from "./Profile";
import Console from "./Console";
import Preferences from "./Preferences";
import Support from "./Support";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <GeneralContextProvider>
        <WatchList />
      </GeneralContextProvider>
      <div className="content">
        <Routes>
          <Route exact path="/" element={<Summary />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/holdings" element={<Holdings />} />
          <Route path="/positions" element={<Positions />} />
          <Route path="/funds" element={<Funds />} />
          <Route path="/apps" element={<Apps />} />

          {/* ✅ Naye routes — profile dropdown ke liye */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/console" element={<Console />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/support" element={<Support />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;