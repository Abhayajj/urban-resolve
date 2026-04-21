import React, { useState, useEffect } from "react";

import DeptDashboardPanel from "../../components/department/DeptDashboardPanel";
import DeptTopbar from "../../components/department/DeptTopbar";
import AssignedComplaintsPanel from "../../components/department/AssignedComplaintPanel";
import ResolutionManagementPanel from "../../components/department/ResolutionManagementPanel";
import CommunicationsPanel from "../../components/department/CommunicationsPanel";
import DeptLoginPanel from "../../components/department/DeptLoginPanel";
import ProfilePanel from "../../components/department/ProfilePanel";

import "../../styles/sc-styles.css";

export default function DepartmentPortal() {
  const [activePanel, setActivePanel] = useState("dp-dash");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("dept_token");
    const deptData = localStorage.getItem("dept_data");

    if (token && deptData) {
      setUser(JSON.parse(deptData));
    } else {
      setActivePanel("dp-login");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("dept_token");
    localStorage.removeItem("dept_data");
    window.location.href = "/";
  };

  if (activePanel === "dp-login") {
    return <DeptLoginPanel activePanel={activePanel} />;
  }

  return (
    <>
      <div className="app-shell" style={{ marginTop: 0, height: "100vh", background: "#F1F5F9" }}>
        {/* SIDEBAR */}
        <aside className="sidebar" style={{ background: "#fff", borderRight: "1px solid #E2E8F0", boxShadow: "4px 0 10px rgba(0,0,0,0.02)" }}>
          
          <div className="sidebar-brand">
            <div className="zone-pill dept">Dept. Zone</div>
            {user ? (
              <div 
                className="user-row" 
                onClick={() => setActivePanel("dp-profile")} 
                style={{ cursor: "pointer", transition: "0.2s" }}
              >
                <div className="user-av amber">{user.name?.[0]}</div>
                <div>
                  <div className="user-name">{user.departmentName}</div>
                  <div className="user-sub">{user.name}</div>
                </div>
              </div>
            ) : (
              <div className="user-row">
                <div className="user-av amber">?</div>
                <div>
                  <div className="user-name">Guest</div>
                  <div className="user-sub">Please login</div>
                </div>
              </div>
            )}
          </div>

          <div className="nav-section" style={{ color: "#94A3B8", fontWeight: 800, fontSize: "10px", padding: "20px 20px 10px" }}>MAIN CONSOLE</div>
          <div className={`nav-item ${activePanel === "dp-dash" ? "active" : ""}`} 
               style={{ margin: "4px 12px", borderRadius: "12px", transition: "0.3s" }} 
               onClick={() => setActivePanel("dp-dash")}>
            <span className="nav-label">Dashboard</span>
          </div>
          <div className={`nav-item ${activePanel === "dp-complaints" ? "active" : ""}`} 
               style={{ margin: "4px 12px", borderRadius: "12px", transition: "0.3s" }} 
               onClick={() => setActivePanel("dp-complaints")}>
            <span className="nav-label">Assigned Complaints</span>
          </div>
          <div className={`nav-item ${activePanel === "dp-resolve" ? "active" : ""}`} 
               style={{ margin: "4px 12px", borderRadius: "12px", transition: "0.3s" }} 
               onClick={() => setActivePanel("dp-resolve")}>
            <span className="nav-label">Resolution Management</span>
          </div>
          <div className={`nav-item ${activePanel === "dp-comms" ? "active" : ""}`} 
               style={{ margin: "4px 12px", borderRadius: "12px", transition: "0.3s" }} 
               onClick={() => setActivePanel("dp-comms")}>
            <span className="nav-label">Communications</span>
          </div>

          <div className="nav-section">Account</div>
          <div className={`nav-item ${activePanel === "dp-profile" ? "active" : ""}`} 
               style={{ margin: "4px 12px", borderRadius: "12px", transition: "0.3s" }} 
               onClick={() => setActivePanel("dp-profile")}>
            <span className="nav-label">My Profile</span>
          </div>

          <div className="sidebar-foot">
            <div className="logout-btn" onClick={handleLogout} style={{ cursor: "pointer" }}>Sign Out</div>
          </div>
        </aside>

        {/* MAIN AREA */}
        <div className="main-wrap">
          <DeptTopbar user={user} setActivePanel={setActivePanel} />
          
          {/* PANELS */}
          <div className="page-body">
            {activePanel==="dp-dash" && <DeptDashboardPanel user={user} />}
            {activePanel==="dp-complaints" && <AssignedComplaintsPanel activePanel={activePanel} user={user} />}
            {activePanel==="dp-resolve" && <ResolutionManagementPanel activePanel={activePanel} user={user} />}
            {activePanel==="dp-comms" && <CommunicationsPanel activePanel={activePanel} user={user} />}
            {activePanel==="dp-profile" && <ProfilePanel user={user} />}
          </div>
        </div>
      </div>
    </>
  );
}