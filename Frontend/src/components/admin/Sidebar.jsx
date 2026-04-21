import React from "react";

export default function Sidebar({ activePanel, setActivePanel, user, handleLogout }) {
  const changePanel = (panel) => {
    setActivePanel(panel);
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "M3 3h7v7H3V3zM14 3h7v7h-7V3zM14 14h7v7h-7v-7zM3 14h7v7H3v-7z", section: "Overview" },
    { id: "analytics", label: "Analytics", icon: "M22 12h-4l-3 9L9 3l-3 9H2", section: "Overview" },
    { id: "users", label: "Departments", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100-8 4 4 0 000 8z", section: "Management" },
    { id: "complaints", label: "Complaints", icon: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z", section: "Management" },
    { id: "assign", label: "Assignments", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", section: "Management" },
    { id: "notifs", label: "Broadcast", icon: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9", section: "Communication" },
  ];

  return (
    <aside className="v2-sidebar">
      <div className="v2-sidebar-brand">
        <div className="v2-brand-logo">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className="v2-brand-text">
          <span className="v2-brand-name">Urban Resolve</span>
          <span className="v2-brand-tag">Admin Console</span>
        </div>
      </div>

      <div className="v2-sidebar-user">
        <div className="v2-user-av">SA</div>
        <div className="v2-user-info">
          <div className="v2-user-name">Super Admin</div>
          <div className="v2-user-status">System Active</div>
        </div>
      </div>

      <nav className="v2-sidebar-nav">
        {["Overview", "Management", "Communication"].map(section => (
          <div key={section} className="v2-nav-group">
            <div className="v2-nav-header">{section}</div>
            {menuItems.filter(item => item.section === section).map(item => (
              <div 
                key={item.id} 
                className={`v2-nav-item ${activePanel === item.id ? "active" : ""}`}
                onClick={() => changePanel(item.id)}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d={item.icon} />
                </svg>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        ))}
      </nav>

      <div className="v2-sidebar-footer">
        <button className="v2-logout-btn" onClick={handleLogout}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Sign Out</span>
        </button>
      </div>

      <style>{`
        .v2-sidebar {
          width: 280px; height: 100vh; background: #0F172A; color: #fff;
          display: flex; flex-direction: column; padding: 24px;
          border-right: 1px solid rgba(255,255,255,0.05); position: fixed; left: 0; top: 0;
        }
        .v2-sidebar-brand { display: flex; align-items: center; gap: 14px; margin-bottom: 40px; }
        .v2-brand-logo { 
          width: 42px; height: 42px; background: linear-gradient(135deg, #3B82F6, #1D4ED8);
          border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #fff;
          box-shadow: 0 8px 16px rgba(37, 99, 235, 0.2);
        }
        .v2-brand-text { display: flex; flex-direction: column; }
        .v2-brand-name { font-size: 18px; font-weight: 800; letter-spacing: -0.5px; }
        .v2-brand-tag { font-size: 11px; color: #64748B; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }

        .v2-sidebar-user {
          display: flex; align-items: center; gap: 12px; padding: 16px;
          background: rgba(255,255,255,0.03); border-radius: 16px; margin-bottom: 30px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .v2-user-av { 
          width: 36px; height: 36px; border-radius: 10px; background: #EF4444;
          display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px;
        }
        .v2-user-info { display: flex; flex-direction: column; }
        .v2-user-name { font-size: 14px; font-weight: 700; color: #F1F5F9; }
        .v2-user-status { font-size: 11px; color: #10B981; font-weight: 600; }

        .v2-sidebar-nav { flex: 1; overflow-y: auto; }
        .v2-nav-group { margin-bottom: 24px; }
        .v2-nav-header { 
          font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; 
          letter-spacing: 1.5px; margin-bottom: 12px; margin-left: 12px;
        }
        .v2-nav-item {
          display: flex; align-items: center; gap: 12px; padding: 12px 16px;
          color: #94A3B8; border-radius: 12px; cursor: pointer; transition: 0.2s;
          margin-bottom: 4px; font-weight: 600; font-size: 14px;
        }
        .v2-nav-item:hover { background: rgba(255,255,255,0.05); color: #fff; }
        .v2-nav-item.active { background: #2563EB; color: #fff; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); }

        .v2-sidebar-footer { margin-top: auto; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05); }
        .v2-logout-btn {
          width: 100%; display: flex; align-items: center; gap: 12px; padding: 12px;
          background: none; border: none; color: #64748B; cursor: pointer; transition: 0.2s;
          font-weight: 600; font-size: 14px; border-radius: 12px;
        }
        .v2-logout-btn:hover { color: #F87171; background: rgba(239, 68, 68, 0.05); }
      `}</style>
    </aside>
  );
}