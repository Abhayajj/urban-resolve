import React from "react";

export default function CitizenSidebar({ activePanel, setActivePanel }) {

  const changePanel = (panel) => {
    if (setActivePanel) {
      setActivePanel(panel);
    }
  };

  return (
    <aside className="sidebar">

      <div className="sidebar-brand">
        <div className="zone-pill citizen">
          Citizen Zone
        </div>

        <div className="user-row">
          <div className="user-av green">RK</div>
          <div>
            <div className="user-name">Rahul Kumar</div>
            <div className="user-sub">Ward 7, Block B</div>
          </div>
        </div>
      </div>

      <div className="nav-section">My Services</div>

      {/* DASHBOARD */}
      <div
        className={`nav-item ${activePanel === "cp-dash" ? "active" : ""}`}
        onClick={() => changePanel("cp-dash")}
      >
        <span className="nav-label">My Dashboard</span>
      </div>

      {/* FILE COMPLAINT */}
      <div
        className={`nav-item ${activePanel === "cp-file" ? "active" : ""}`}
        onClick={() => changePanel("cp-file")}
      >
        <span className="nav-label">File Complaint</span>
      </div>

      {/* HISTORY */}
      <div
        className={`nav-item ${activePanel === "cp-history" ? "active" : ""}`}
        onClick={() => changePanel("cp-history")}
      >
        <span className="nav-label">Complaint History</span>
      </div>

      {/* TRACK */}
      <div
        className={`nav-item ${activePanel === "cp-track" ? "active" : ""}`}
        onClick={() => changePanel("cp-track")}
      >
        <span className="nav-label">Track Complaints</span>
      </div>

      {/* NOTIFICATIONS */}
      <div
        className={`nav-item ${activePanel === "cp-notifs" ? "active" : ""}`}
        onClick={() => changePanel("cp-notifs")}
      >
        <span className="nav-label">Notifications</span>
      </div>

      {/* FEEDBACK */}
      <div
        className={`nav-item ${activePanel === "cp-feedback" ? "active" : ""}`}
        onClick={() => changePanel("cp-feedback")}
      >
        <span className="nav-label">Feedback</span>
      </div>

      <div className="nav-section">Account</div>

      {/* PROFILE */}
      <div
        className={`nav-item ${activePanel === "cp-profile" ? "active" : ""}`}
        onClick={() => changePanel("cp-profile")}
      >
        <span className="nav-label">My Profile</span>
      </div>

      {/* LOGIN */}
      <div
        className={`nav-item ${activePanel === "cp-login" ? "active" : ""}`}
        onClick={() => changePanel("cp-login")}
      >
        <span className="nav-label">Login / Register</span>
      </div>

    </aside>
  );
}