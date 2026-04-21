import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CitizenPortal from "./pages/citizen/CitizenPortal";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DepartmentPortal from "./pages/department/DepartmentPortal";
import GeneralPortal from "./pages/General/GeneralPortal";

function App() {
  return (
    <Router>
      <Routes>

        {/* General Website */}
        <Route path="/general/*" element={<GeneralPortal />} />

        {/* Citizen Portal */}
        <Route path="/citizen" element={<CitizenPortal />} />

        {/* Department Portal */}
        <Route path="/department" element={<DepartmentPortal />} />

        {/* Admin Portal */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Default Landing */}
        <Route path="/*" element={<GeneralPortal />} />

      </Routes>
    </Router>
  );
}

export default App;