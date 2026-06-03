import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Analytics from "../pages/Analytics";
import PublicStats from "../pages/PublicStats";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/analytics/:id" element={<Analytics />} />
      <Route
  path="/stats/:shortCode"
  element={<PublicStats />}
/>
    </Routes>
  );
}

export default AppRoutes;