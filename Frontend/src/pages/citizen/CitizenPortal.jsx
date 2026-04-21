import React, { useState, useEffect } from "react";
import CitizenTopbar from "../../components/citizen/CitizenTopbar";
import CitizenDashboard from "../../components/citizen/CitizenDashboardPanel";
import FileComplaintPanel from "../../components/citizen/FileComplaintPanel";
import ComplaintHistory from "../../components/citizen/ComplaintHistory";
import TrackComplaints from "../../components/citizen/TrackComplaints";
import NotificationsPanel from "../../components/citizen/NotificationsPanel";
import FeedbackPanel from "../../components/citizen/FeedbackPanel";
import ProfilePanel from "../../components/citizen/ProfilePanel";
import LoginPanel from "../../components/citizen/LoginPanel";

import "../../styles/sc-styles.css";

export default function CitizenPortal() {
  const [user, setUser] = useState(() => {
    const data = localStorage.getItem("citizen_data");
    return data ? JSON.parse(data) : null;
  });

  const [activePanel, setActivePanel] = useState(() => {
    const token = localStorage.getItem("citizen_token");
    return token ? "cp-dash" : "cp-login";
  });

  // Auth check is now handled during state initialization

  const handleLogout = () => {
    localStorage.removeItem("citizen_token");
    localStorage.removeItem("citizen_data");
    window.location.href = "/";
  };

  if (activePanel === "cp-login") {
    return <LoginPanel 
      activePanel={activePanel} 
      setActivePanel={setActivePanel} 
      setUser={setUser}
    />;
  }

  return (
    <>
      <CitizenTopbar />

      <div className="app-shell">

        {/* SIDEBAR */}
        <aside className="sidebar">

          <div className="sidebar-brand">
            <div className="zone-pill citizen">
              Citizen Zone
            </div>

            {user ? (
              <div className="user-row" onClick={() => setActivePanel("cp-profile")} style={{ cursor: "pointer" }}>
                <div className="user-av green">{user.firstName?.[0]}{user.lastName?.[0]}</div>
                <div>
                  <div className="user-name">{user.firstName} {user.lastName}</div>
                  <div className="user-sub">{user.ward}, {user.block}</div>
                </div>
              </div>
            ) : (
              <div className="user-row">
                <div className="user-av green">?</div>
                <div>
                  <div className="user-name">Guest User</div>
                  <div className="user-sub">Please login</div>
                </div>
              </div>
            )}
          </div>

          <div className="nav-section">My Services</div>

          <div
            className={`nav-item ${activePanel === "cp-dash" ? "active" : ""}`}
            onClick={() => user ? setActivePanel("cp-dash") : setActivePanel("cp-login")}
          >
            <span className="nav-label">My Dashboard</span>
          </div>

          <div
            className={`nav-item ${activePanel === "cp-file" ? "active" : ""}`}
            onClick={() => user ? setActivePanel("cp-file") : setActivePanel("cp-login")}
          >
            <span className="nav-label">File Complaint</span>
          </div>

          <div
            className={`nav-item ${activePanel === "cp-history" ? "active" : ""}`}
            onClick={() => user ? setActivePanel("cp-history") : setActivePanel("cp-login")}
          >
            <span className="nav-label">Complaint History</span>
          </div>

          <div
            className={`nav-item ${activePanel === "cp-track" ? "active" : ""}`}
            onClick={() => user ? setActivePanel("cp-track") : setActivePanel("cp-login")}
          >
            <span className="nav-label">Track Complaints</span>
            <span className="nbadge blue">2</span>
          </div>

          <div
            className={`nav-item ${activePanel === "cp-notifs" ? "active" : ""}`}
            onClick={() => user ? setActivePanel("cp-notifs") : setActivePanel("cp-login")}
          >
            <span className="nav-label">Notifications</span>
            <span className="nbadge red">3</span>
          </div>

          <div
            className={`nav-item ${activePanel === "cp-feedback" ? "active" : ""}`}
            onClick={() => user ? setActivePanel("cp-feedback") : setActivePanel("cp-login")}
          >
            <span className="nav-label">Feedback</span>
            <span className="nbadge amber">2</span>
          </div>

          <div className="nav-section">Account</div>

          <div
            className={`nav-item ${activePanel === "cp-profile" ? "active" : ""}`}
            onClick={() => user ? setActivePanel("cp-profile") : setActivePanel("cp-login")}
          >
            <span className="nav-label">My Profile</span>
          </div>

          {user && (
            <div className="sidebar-foot">
              <div className="logout-btn" onClick={handleLogout} style={{ cursor: "pointer" }}>
                Sign Out
              </div>
            </div>
          )}

        </aside>

        {/* MAIN CONTENT */}
        <div className="main-wrap">

          {/* PANELS */}

          {activePanel === "cp-dash" && (
            <CitizenDashboard activePanel={activePanel} setActivePanel={setActivePanel} user={user} />
          )}

          {activePanel === "cp-file" && (
            <FileComplaintPanel activePanel={activePanel} setActivePanel={setActivePanel} />
          )}

          {activePanel === "cp-history" && (
            <ComplaintHistory activePanel={activePanel} setActivePanel={setActivePanel} />
          )}

          {activePanel === "cp-track" && (
            <TrackComplaints
              activePanel={activePanel}
              setActivePanel={setActivePanel}
            />
          )}

          {activePanel === "cp-notifs" && (
            <NotificationsPanel
              activePanel={activePanel}
              setActivePanel={setActivePanel}
              user={user}
            />
          )}
          {activePanel === "cp-feedback" && (
            <FeedbackPanel
              activePanel={activePanel}
              setActivePanel={setActivePanel}
            />
          )}
          {activePanel === "cp-profile" && (
            <ProfilePanel
              activePanel={activePanel}
              setActivePanel={setActivePanel}
              user={user}
              setUser={setUser}
            />
          )}

        </div>

      </div>
    </>
  );
}