import React, { useState, useEffect } from "react";

export default function DashboardPanel({ setActivePanel }) {
  const [stats, setStats] = useState({
    citizens: 0,
    departments: 0,
    complaints: 0,
    resolved: 0,
    pending: 0
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const headers = { "Authorization": `Bearer ${token}` };

        const [citRes, deptRes, compRes] = await Promise.all([
          fetch("http://localhost:5000/api/v1/admin/citizens", { headers }),
          fetch("http://localhost:5000/api/v1/admin/departments", { headers }),
          fetch("http://localhost:5000/api/v1/complaints", { headers })
        ]);

        const citizens = await citRes.json();
        const departments = await deptRes.json();
        const complaints = await compRes.json();

        if (Array.isArray(citizens) && Array.isArray(departments) && Array.isArray(complaints)) {
          setStats({
            citizens: citizens.length,
            departments: departments.length,
            complaints: complaints.length,
            resolved: complaints.filter(c => c.status === "Resolved").length,
            pending: complaints.filter(c => c.status === "Pending").length
          });
          setRecentComplaints(complaints.slice(0, 5));
        }
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="panel active" id="p-dash">
        <div className="page-intro">
          <h2>System Overview</h2>
          <p>Real-time statistics and system activity</p>
        </div>

        <div className="v2-stat-grid" style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "24px", 
          marginBottom: "32px" 
        }}>
          {[
            { label: "Total Citizens", val: stats.citizens, color: "#3B82F6", bg: "#EFF6FF" },
            { label: "Departments", val: stats.departments, color: "#8B5CF6", bg: "#F5F3FF" },
            { label: "Total Cases", val: stats.complaints, color: "#F59E0B", bg: "#FFFBEB" },
            { label: "Resolved", val: stats.resolved, color: "#10B981", bg: "#ECFDF5" },
            { label: "Pending", val: stats.pending, color: "#EF4444", bg: "#FEF2F2" }
          ].map((item, idx) => (
            <div key={idx} style={{ 
              background: "#fff", padding: "24px", borderRadius: "20px", 
              border: "1px solid #F1F5F9", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)"
            }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "#64748B", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {item.label}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span style={{ fontSize: "28px", fontWeight: "800", color: "#0F172A" }}>{item.val}</span>
                <span style={{ 
                  fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "6px",
                  background: item.bg, color: item.color 
                }}>Live</span>
              </div>
            </div>
          ))}
        </div>

        {stats.pending > 0 && (
          <div
            style={{
              background: "linear-gradient(135deg,var(--navy2),var(--blue2))",
              borderRadius: 14,
              padding: "18px 22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
              flexWrap: "wrap", gap: 10
            }}
          >
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 3 }}>
                {stats.pending} complaints need assignment
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)" }}>
                Unassigned complaints are waiting for department routing
              </div>
            </div>
            <button
              className="btn"
              style={{ background: "#fff", color: "var(--navy2)", fontSize: 13 }}
              onClick={() => setActivePanel("assign")}
            >
              Assign Now →
            </button>
          </div>
        )}

        <div className="grid-2">
          <div className="card">
            <div className="card-hd">
              <span className="card-title">Recent Complaints</span>
              <span className="card-action" onClick={() => setActivePanel("complaints")}>View all →</span>
            </div>
            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Category</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentComplaints.map(c => (
                    <tr key={c._id}>
                      <td><span className="cid">#{c._id.slice(-4)}</span></td>
                      <td>{c.category}</td>
                      <td>
                        <span className={`badge ${
                          c.status === "Pending" ? "b-pending" : c.status === "In Progress" ? "b-progress" : "b-resolved"
                        }`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {recentComplaints.length === 0 && (
                    <tr><td colSpan="3" style={{textAlign:"center"}}>No complaints yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-hd">
              <span className="card-title">Recent System Activity</span>
            </div>
            {recentComplaints.slice(0, 4).map(c => (
              <div key={c._id} className="act-item">
                <div className="act-dot" style={{ background: c.status === "Resolved" ? "var(--green)" : "var(--amber)" }} />
                <div>
                  <div className="act-text">Complaint <strong>#{c._id.slice(-4)}</strong> filed in {c.category}</div>
                  <div className="act-time">{new Date(c.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}