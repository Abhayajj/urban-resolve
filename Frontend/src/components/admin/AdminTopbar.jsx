import React from "react";

export default function AdminTopbar({ title, user }) {
  const panelTitles = {
    dashboard: "System Overview",
    complaints: "Complaint Monitoring",
    users: "Departments & Citizens",
    categories: "Service Categories",
    assign: "Complaint Routing",
    notifs: "Emergency Broadcast",
    analytics: "Statistical Reports"
  };

  const [showProfile, setShowProfile] = React.useState(false);
  const [showNotifs, setShowNotifs] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_data");
    window.location.href = "/";
  };

  return (
    <header className="v2-topbar">
      <div className="v2-topbar-left">
        <h1 className="v2-page-title">{panelTitles[title] || "Admin Console"}</h1>
        <div className="v2-breadcrumb">
          <span>Urban Resolve</span>
          <span className="v2-slash">/</span>
          <span className="v2-active">{title}</span>
        </div>
      </div>

      <div className="v2-topbar-right">
        <div className="v2-search-bar">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input type="text" placeholder="Global search..." />
        </div>

        <div className="v2-top-actions">
          <div className="v2-action-btn" onClick={() => setShowNotifs(!showNotifs)}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            <span className="v2-dot"></span>
            
            {showNotifs && (
              <div className="v2-dropdown notif-dd">
                <div className="dd-header">Notifications</div>
                <div className="dd-item">No new alerts</div>
              </div>
            )}
          </div>
          
          <div className="v2-profile-pill" style={{ position: "relative", cursor: "pointer" }} onClick={() => setShowProfile(!showProfile)}>
            <div className="v2-profile-av">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : "AD"}
            </div>
            <span>{user?.name || "Administrator"}</span>
            
            {showProfile && (
              <div className="v2-dropdown profile-dd">
                <div className="dd-header">Account Settings</div>
                <div className="dd-item" onClick={() => window.dispatchEvent(new CustomEvent('changePanel', {detail: 'profile'}))}>Profile Settings</div>
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
          padding: 0 40px; position: sticky; top: 0; z-index: 100;
        }
        .v2-page-title { font-size: 20px; font-weight: 800; color: #0F172A; margin: 0; }
        .v2-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 12px; margin-top: 2px; }
        .v2-breadcrumb span { color: #64748B; font-weight: 600; }
        .v2-slash { color: #CBD5E1; }
        .v2-breadcrumb .v2-active { color: #3B82F6; text-transform: capitalize; }

        .v2-topbar-right { display: flex; align-items: center; gap: 30px; }
        .v2-search-bar {
          display: flex; align-items: center; gap: 10px; background: #F8FAFC;
          padding: 10px 16px; border-radius: 12px; border: 1px solid #F1F5F9; width: 300px;
        }
        .v2-search-bar input { border: none; background: none; outline: none; font-size: 14px; color: #1E293B; width: 100%; }
        .v2-search-bar svg { color: #94A3B8; }

        .v2-top-actions { display: flex; align-items: center; gap: 20px; }
        .v2-action-btn { 
          width: 44px; height: 44px; border-radius: 12px; background: #F8FAFC;
          display: flex; align-items: center; justify-content: center; color: #64748B;
          position: relative; cursor: pointer; transition: 0.2s;
        }
        .v2-action-btn:hover { background: #F1F5F9; color: #0F172A; }
        .v2-dot { 
          position: absolute; top: 12px; right: 12px; width: 8px; height: 8px;
          background: #EF4444; border: 2px solid #fff; border-radius: 50%;
        }

        .v2-profile-pill {
          display: flex; align-items: center; gap: 10px; padding: 6px 14px 6px 6px;
          background: #0F172A; border-radius: 50px; color: #fff; font-size: 13px; font-weight: 700;
        }
        .v2-profile-av {
          width: 32px; height: 32px; border-radius: 50%; background: #2563EB;
          display: flex; align-items: center; justify-content: center; font-size: 11px;
        }

        .v2-dropdown {
          position: absolute; top: 100%; right: 0; margin-top: 10px;
          background: #fff; border: 1px solid #F1F5F9; border-radius: 12px;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); width: 200px;
          overflow: hidden; z-index: 1000;
        }
        .dd-header { padding: 12px 16px; font-size: 11px; font-weight: 800; color: #94A3B8; text-transform: uppercase; border-bottom: 1px solid #F1F5F9; }
        .dd-item { padding: 12px 16px; font-size: 13px; color: #1E293B; cursor: pointer; transition: 0.2s; text-align: left; }
        .dd-item:hover { background: #F8FAFC; color: #3B82F6; }
        .notif-dd { width: 280px; }
      `}</style>
    </header>
  );
}