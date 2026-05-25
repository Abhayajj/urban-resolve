import React, { useState, useEffect } from "react";
import CitizenTopbar from "../../components/citizen/CitizenTopbar";
import GovHeader from "../../components/General/GovHeader";
import CitizenDashboard from "../../components/citizen/CitizenDashboardPanel";
import FileComplaintPanel from "../../components/citizen/FileComplaintPanel";
import ComplaintHistory from "../../components/citizen/ComplaintHistory";
import TrackComplaints from "../../components/citizen/TrackComplaints";
import NotificationsPanel from "../../components/citizen/NotificationsPanel";
import FeedbackPanel from "../../components/citizen/FeedbackPanel";
import ProfilePanel from "../../components/citizen/ProfilePanel";
import LoginPanel from "../../components/citizen/LoginPanel";
import UrbanAICopilot from "../../components/General/UrbanAICopilot";

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

  const [aiDraftGrievance, setAiDraftGrievance] = useState(null);
  const [lang, setLang] = useState(() => localStorage.getItem("active_lang") || "EN");

  useEffect(() => {
    const handleLang = (e) => {
      setLang(e.detail);
      localStorage.setItem("active_lang", e.detail);
    };
    document.addEventListener("langChange", handleLang);
    return () => document.removeEventListener("langChange", handleLang);
  }, []);

  const t = {
    EN: {
      zone: "Citizen Zone",
      dash: "My Dashboard",
      file: "File Complaint",
      history: "Complaint History",
      track: "Track Complaints",
      notifs: "Notifications",
      feedback: "Feedback",
      profile: "My Profile",
      signOut: "Sign Out",
      myServices: "My Services",
      account: "Account",
      guest: "Guest User",
      pleaseLogin: "Please login"
    },
    HI: {
      zone: "नागरिक क्षेत्र",
      dash: "मेरा डैशबोर्ड",
      file: "शिकायत दर्ज करें",
      history: "शिकायत इतिहास",
      track: "शिकायत ट्रैक करें",
      notifs: "सूचनाएं",
      feedback: "प्रतिक्रिया",
      profile: "मेरी प्रोफाइल",
      signOut: "साइन आउट",
      myServices: "मेरी सेवाएं",
      account: "खाता",
      guest: "अतिथि उपयोगकर्ता",
      pleaseLogin: "कृपया लॉगिन करें"
    }
  }[lang];

  // Auth check is now handled during state initialization

  const handleLogout = () => {
    localStorage.removeItem("citizen_token");
    localStorage.removeItem("citizen_data");
    window.location.href = "/";
  };

  if (activePanel === "cp-login") {
    return (
      <>
        <GovHeader />
        <LoginPanel 
          activePanel={activePanel} 
          setActivePanel={setActivePanel} 
          setUser={setUser}
        />
      </>
    );
  }

  return (
    <>
      <GovHeader />
      <CitizenTopbar />

      <div className="app-shell">

        {/* SIDEBAR */}
        <aside className="sidebar">

          <div className="sidebar-brand">
            <div className="zone-pill citizen">
              {t.zone}
            </div>

            {user ? (
              <div className="user-row" onClick={() => setActivePanel("cp-profile")} style={{ cursor: "pointer" }}>
                <div className="user-av green">{user.firstName?.[0]}{user.lastName?.[0]}</div>
                <div>
                  <div className="user-name" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    {user.firstName} {user.lastName}
                    {user.isDigiLockerVerified && (
                      <span 
                        title="DigiLocker / Aadhaar e-Verified Profile" 
                        style={{ background: "#D1F2D9", color: "#10B981", fontSize: "9px", padding: "1px 5px", borderRadius: "4px", fontWeight: "800", textTransform: "uppercase" }}
                      >
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <div className="user-sub">{user.ward}, {user.block}</div>
                </div>
              </div>
            ) : (
              <div className="user-row">
                <div className="user-av green">?</div>
                <div>
                  <div className="user-name">{t.guest}</div>
                  <div className="user-sub">{t.pleaseLogin}</div>
                </div>
              </div>
            )}
          </div>

          <div className="nav-section">{t.myServices}</div>

          <div
            className={`nav-item ${activePanel === "cp-dash" ? "active" : ""}`}
            onClick={() => user ? setActivePanel("cp-dash") : setActivePanel("cp-login")}
          >
            <span className="nav-label">{t.dash}</span>
          </div>

          <div
            className={`nav-item ${activePanel === "cp-file" ? "active" : ""}`}
            onClick={() => user ? setActivePanel("cp-file") : setActivePanel("cp-login")}
          >
            <span className="nav-label">{t.file}</span>
          </div>

          <div
            className={`nav-item ${activePanel === "cp-history" ? "active" : ""}`}
            onClick={() => user ? setActivePanel("cp-history") : setActivePanel("cp-login")}
          >
            <span className="nav-label">{t.history}</span>
          </div>

          <div
            className={`nav-item ${activePanel === "cp-track" ? "active" : ""}`}
            onClick={() => user ? setActivePanel("cp-track") : setActivePanel("cp-login")}
          >
            <span className="nav-label">{t.track}</span>
            <span className="nbadge blue">2</span>
          </div>

          <div
            className={`nav-item ${activePanel === "cp-notifs" ? "active" : ""}`}
            onClick={() => user ? setActivePanel("cp-notifs") : setActivePanel("cp-login")}
          >
            <span className="nav-label">{t.notifs}</span>
            <span className="nbadge red">3</span>
          </div>

          <div
            className={`nav-item ${activePanel === "cp-feedback" ? "active" : ""}`}
            onClick={() => user ? setActivePanel("cp-feedback") : setActivePanel("cp-login")}
          >
            <span className="nav-label">{t.feedback}</span>
            <span className="nbadge amber">2</span>
          </div>

          <div className="nav-section">{t.account}</div>

          <div
            className={`nav-item ${activePanel === "cp-profile" ? "active" : ""}`}
            onClick={() => user ? setActivePanel("cp-profile") : setActivePanel("cp-login")}
          >
            <span className="nav-label">{t.profile}</span>
          </div>

          {user && (
            <div className="sidebar-foot">
              <div className="logout-btn" onClick={handleLogout} style={{ cursor: "pointer" }}>
                {t.signOut}
              </div>
            </div>
          )}

        </aside>

        {/* MAIN CONTENT */}
        <div className="main-wrap">

          {/* PANELS */}

          {activePanel === "cp-dash" && (
            <CitizenDashboard activePanel={activePanel} setActivePanel={setActivePanel} user={user} lang={lang} />
          )}

          {activePanel === "cp-file" && (
            <FileComplaintPanel 
              activePanel={activePanel} 
              setActivePanel={setActivePanel} 
              aiDraft={aiDraftGrievance}
              clearAiDraft={() => setAiDraftGrievance(null)}
              lang={lang}
            />
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

      <UrbanAICopilot 
        onAutoFill={(draft) => {
          setAiDraftGrievance(draft);
          setActivePanel("cp-file");
        }} 
      />
    </>
  );
}