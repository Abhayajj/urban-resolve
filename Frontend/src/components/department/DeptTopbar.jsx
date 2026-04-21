import React, { useState, useEffect } from "react";
import API_URL from '../../config.js';

export default function DeptTopbar({ user, setActivePanel }) {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const token = localStorage.getItem("dept_token");
        const res = await fetch(API_URL + "/notifications/all", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setNotifications(data.data.slice(0, 5));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifs();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("dept_token");
    localStorage.removeItem("dept_data");
    window.location.href = "/";
  };

  const handleSettings = () => {
    setShowProfile(false);
    // Usually redirect to profile or settings panel
    if (setActivePanel) setActivePanel("dp-profile");
    else alert("Settings coming soon for your department!");
  };

  return (
    <header className="v2-topbar dept-variant">
      <div className="v2-topbar-left">
        <h1 className="v2-page-title">Department Console</h1>
        <div className="v2-breadcrumb">
          <span>{user?.departmentName || "Urban Resolve"}</span>
          <span className="v2-slash">/</span>
          <span className="v2-active">Management</span>
        </div>
      </div>

      <div className="v2-topbar-right">
        <div className="v2-top-actions">
          
          <div className="v2-action-btn" onClick={() => setShowNotifs(!showNotifs)}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            {notifications.length > 0 && <span className="v2-dot amber"></span>}

            {showNotifs && (
              <div className="v2-dropdown notif-dd">
                <div className="dd-header">System Broadcasts</div>
                {notifications.map(n => (
                  <div key={n._id} className="dd-item notif-item">
                    <div style={{ fontWeight: 800, fontSize: 12 }}>{n.title}</div>
                    <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{n.message.slice(0, 40)}...</div>
                  </div>
                ))}
                {notifications.length === 0 && <div className="dd-item">No new alerts</div>}
              </div>
            )}
          </div>
          
          <div className="v2-profile-pill amber-theme" onClick={() => setShowProfile(!showProfile)}>
            <div className="v2-profile-av amber">
              {user?.name?.[0] || "D"}
            </div>
            <span>{user?.name || "Official"}</span>

            {showProfile && (
              <div className="v2-dropdown">
                <div className="dd-header">Account Access</div>
                <div className="dd-item" onClick={handleSettings}>Account Settings</div>
                <div className="dd-item" style={{ color: "#EF4444" }} onClick={handleLogout}>Sign Out</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .v2-topbar {
          height: 80px; background: #fff; border-bottom: 1px solid #F1F5F9;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 40px; position: sticky; top: 0; z-index: 1000;
        }
        .v2-page-title { font-size: 20px; font-weight: 800; color: #0F172A; margin: 0; }
        .v2-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 12px; margin-top: 2px; }
        .v2-breadcrumb span { color: #64748B; font-weight: 600; }
        .v2-slash { color: #CBD5E1; }
        .v2-breadcrumb .v2-active { color: #F59E0B; text-transform: capitalize; }

        .v2-topbar-right { display: flex; align-items: center; gap: 30px; }
        .v2-top-actions { display: flex; align-items: center; gap: 20px; }
        .v2-action-btn { 
          width: 44px; height: 44px; border-radius: 12px; background: #FFFBEB;
          display: flex; align-items: center; justify-content: center; color: #D97706;
          position: relative; cursor: pointer; transition: 0.2s;
        }
        .v2-dot.amber { background: #F59E0B; position: absolute; top: 12px; right: 12px; width: 8px; height: 8px; border: 2px solid #fff; border-radius: 50%; }

        .v2-profile-pill {
          display: flex; align-items: center; gap: 10px; padding: 6px 14px 6px 6px;
          background: #0F172A; border-radius: 50px; color: #fff; font-size: 13px; font-weight: 700;
          cursor: pointer; position: relative;
        }
        .v2-profile-av.amber {
          width: 32px; height: 32px; border-radius: 50%; background: #F59E0B;
          display: flex; align-items: center; justify-content: center; font-size: 11px;
        }

        .v2-dropdown {
          position: absolute; top: 100%; right: 0; margin-top: 10px;
          background: #fff; border: 1px solid #F1F5F9; border-radius: 12px;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); width: 200px; overflow: hidden;
        }
        .notif-dd { width: 300px; }
        .dd-header { padding: 12px 16px; font-size: 10px; font-weight: 800; color: #94A3B8; text-transform: uppercase; border-bottom: 1px solid #F1F5F9; }
        .dd-item { padding: 12px 16px; font-size: 13px; color: #1E293B; cursor: pointer; text-align: left; }
        .dd-item:hover { background: #F8FAFC; color: #F59E0B; }
        .notif-item { border-bottom: 1px solid #F8FAFC; }

        @media(max-width: 768px) {
          .v2-topbar { padding: 0 20px; }
          .v2-breadcrumb { display: none; }
          .v2-page-title { font-size: 16px; }
        }
      `}</style>
    </header>
  );
}