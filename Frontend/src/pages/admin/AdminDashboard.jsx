import React, { useState, useEffect } from "react";

import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/AdminTopbar";

import DashboardPanel from "../../components/admin/DashboardPanel";
import ComplaintsPanel from "../../components/admin/ComplaintsPanel";
import UsersPanel from "../../components/admin/UsersPanel";
import CategoriesPanel from "../../components/admin/CategoriesPanel";
import AssignmentPanel from "../../components/admin/AssignmentPanel";
import NotificationsPanel from "../../components/admin/NotificationsPanel";
import AnalyticsPanel from "../../components/admin/AnalyticsPanel";
import LoginPanel from "../../components/admin/LoginPanel";
import AdminProfilePanel from "../../components/admin/AdminProfilePanel";

export default function AdminDashboard() {
  const [activePanel, setActivePanel] = useState("dashboard");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const adminData = localStorage.getItem("admin_data");

    if (token && adminData) {
      setUser(JSON.parse(adminData));
    } else {
      setActivePanel("login");
    }

    const handlePanelChange = (e) => {
      if (e.detail) setActivePanel(e.detail);
    };
    window.addEventListener('changePanel', handlePanelChange);
    return () => window.removeEventListener('changePanel', handlePanelChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_data");
    window.location.href = "/";
  };

  const renderPanel = () => {
    switch (activePanel) {
      case "dashboard": return <DashboardPanel setActivePanel={setActivePanel} />;
      case "complaints": return <ComplaintsPanel />;
      case "users": return <UsersPanel />;
      case "categories": return <CategoriesPanel />;
      case "assign": return <AssignmentPanel />;
      case "notifs": return <NotificationsPanel />;
      case "analytics": return <AnalyticsPanel />;
      case "profile": return <AdminProfilePanel user={user} />;
      default: return <DashboardPanel setActivePanel={setActivePanel} />;
    }
  };

  if (activePanel === "login") {
    return <LoginPanel activePanel={activePanel} />;
  }

  return (
    <div className="v2-admin-shell" style={{ display: "flex", background: "#F8FAFC", minHeight: "100vh" }}>
      <Sidebar
        activePanel={activePanel}
        setActivePanel={setActivePanel}
        user={user}
        handleLogout={handleLogout}
      />
      <div className="v2-main-content" style={{ marginLeft: "280px", flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar title={activePanel} user={user} />
        <main className="v2-page-container" style={{ padding: "40px" }}>
          {renderPanel()}
        </main>
      </div>
    </div>
  );
}