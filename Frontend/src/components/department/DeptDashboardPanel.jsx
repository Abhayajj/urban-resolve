import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import API_URL from '../../config.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function DeptDashboardPanel({ user }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("dept_token");
        const res = await fetch(API_URL + "/complaints", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          // Filter complaints for this department if not already filtered by backend
          setComplaints(data);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "Pending").length,
    progress: complaints.filter(c => c.status === "In Progress").length,
    resolved: complaints.filter(c => c.status === "Resolved").length
  };

  const pieData = {
    labels: ['Pending', 'In Progress', 'Resolved'],
    datasets: [{
      data: [stats.pending, stats.progress, stats.resolved],
      backgroundColor: ['#F59E0B', '#3B82F6', '#10B981'],
      borderWidth: 0,
    }]
  };

  return (
    <div className="panel active" id="dp-dash">
      <div className="page-intro">
        <h2 style={{ fontSize: '24px', fontWeight: 800 }}>{user?.departmentName || "Department"} Overview</h2>
        <p style={{ color: '#64748B' }}>Managing {stats.total} total assigned cases</p>
      </div>

      {/* Premium Stat Grid */}
      <div className="v2-stat-grid" style={{ 
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" 
      }}>
        {[
          { label: "Assigned", val: stats.total, color: "#F59E0B", icon: "📋" },
          { label: "Pending", val: stats.pending, color: "#EF4444", icon: "⏳" },
          { label: "Active", val: stats.progress, color: "#3B82F6", icon: "⚙️" },
          { label: "Completed", val: stats.resolved, color: "#10B981", icon: "✅" }
        ].map((s, i) => (
          <div key={i} style={{ 
            background: "#fff", padding: "24px", borderRadius: "20px", border: "1px solid #F1F5F9",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)", position: "relative", overflow: "hidden"
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: s.color }} />
            <div style={{ fontSize: "24px", marginBottom: "10px" }}>{s.icon}</div>
            <div style={{ fontSize: "12px", fontWeight: "800", color: "#94A3B8", textTransform: "uppercase" }}>{s.label}</div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#0F172A", marginTop: "4px" }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Charts Section */}
        <div className="card" style={{ padding: "24px", borderRadius: "24px" }}>
          <div className="card-hd"><span className="card-title">Resolution Distribution</span></div>
          <div style={{ height: "250px", display: "flex", justifyContent: "center" }}>
            <Pie data={pieData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>

        {/* Priority List */}
        <div className="card" style={{ padding: "24px", borderRadius: "24px" }}>
          <div className="card-hd">
            <span className="card-title">High Priority Cases</span>
          </div>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Issue</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {complaints.filter(c => c.status !== "Resolved").slice(0, 5).map(c => (
                  <tr key={c._id}>
                    <td><span className="cid">#{c._id.slice(-4)}</span></td>
                    <td>{c.title}</td>
                    <td><span className={`badge ${c.status === "Pending" ? "b-pending" : "b-progress"}`}>{c.status}</span></td>
                  </tr>
                ))}
                {complaints.length === 0 && <tr><td colSpan="3" style={{textAlign:"center"}}>No active cases</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="card" style={{ marginTop: "20px", padding: "24px", borderRadius: "24px" }}>
        <div className="card-hd"><span className="card-title">Recent Activity Log</span></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
          {complaints.slice(0, 4).map(c => (
            <div key={c._id} style={{ 
              padding: "15px", borderRadius: "16px", background: "#F8FAFC", border: "1px solid #F1F5F9",
              display: "flex", gap: "12px", alignItems: "center"
            }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: c.status === "Resolved" ? "#10B981" : "#F59E0B" }} />
              <div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#1E293B" }}>#{c._id.slice(-4)} - {c.category}</div>
                <div style={{ fontSize: "11px", color: "#64748B" }}>Updated on {new Date(c.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}