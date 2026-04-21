import React, { useState, useEffect } from "react";

export default function NotificationsPanel({ activePanel, setActivePanel, user }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("citizen_token");
        const res = await fetch(`${API_URL}/notifications/citizen?ward=${user?.ward || ''}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setNotifications(data.data);
        }
      } catch (error) {
        console.error("Error fetching notifications", error);
      } finally {
        setLoading(false);
      }
    };
    if (activePanel === "cp-notifs" && user) {
      fetchNotifications();
    }
  }, [activePanel, user]);

  return (
    <>
      <div className={`panel ${activePanel === "cp-notifs" ? "active" : ""}`} id="cp-notifs">
        <div className="page-intro">
          <h2>Notifications</h2>
          <p>Real-time updates and official announcements</p>
        </div>

        <div className="card">
          {loading ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--gray-400)" }}>Checking for updates...</div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--gray-400)" }}>No new notifications</div>
          ) : (
            notifications.map((n) => (
              <div key={n._id} style={{ 
                display: "flex", gap: 15, padding: "20px 0", borderBottom: "1px solid var(--gray-50)", 
                alignItems: "flex-start" 
              }}>
                <div style={{ 
                  width: 40, height: 40, borderRadius: 12, background: n.priority === 'Urgent' ? 'var(--r-bg)' : 'var(--sky)',
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <svg width="18" height="18" fill="none" stroke={n.priority === 'Urgent' ? 'var(--r1)' : 'var(--blue)'} strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
                  </svg>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--gray-900)" }}>{n.title}</div>
                    <span style={{ fontSize: 11, color: "var(--gray-400)" }}>{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--gray-600)", lineHeight: 1.6, marginBottom: 8 }}>{n.message}</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span className={`badge ${n.priority === 'Urgent' ? 'b-pending' : n.priority === 'High' ? 'b-progress' : 'b-resolved'}`}>
                      {n.priority} Priority
                    </span>
                    <span className="badge" style={{ background: "var(--gray-100)", color: "var(--gray-500)" }}>
                      {n.target}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}