import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import API_URL from '../../config.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function AnalyticsPanel() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const res = await fetch(API_URL + "/admin/analytics", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading || !stats) return <div style={{ padding: 40, textAlign: "center" }}>Analyzing system data...</div>;

  const pieData = {
    labels: ['Pending', 'In Progress', 'Resolved'],
    datasets: [
      {
        data: [stats.pending, stats.inProgress, stats.resolved],
        backgroundColor: ['#EF4444', '#3B82F6', '#10B981'],
        borderColor: ['#fff', '#fff', '#fff'],
        borderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: Object.keys(stats.categoryStats),
    datasets: [
      {
        label: 'Complaints per Category',
        data: Object.values(stats.categoryStats),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="panel active" id="p-analytics">
      <div className="page-intro">
        <h2>Reports & Analytics</h2>
        <p>Live performance metrics and category-wise trends</p>
      </div>

      <div className="v2-stat-grid" style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
        gap: "20px", 
        marginBottom: "30px" 
      }}>
        {[
          { label: "Total Complaints", val: stats.totalComplaints, color: "#3B82F6", sub: "All time" },
          { label: "Resolution Rate", val: `${Math.round((stats.resolved / (stats.totalComplaints || 1)) * 100)}%`, color: "#10B981", sub: "Completed" },
          { label: "Pending Tasks", val: stats.pending, color: "#EF4444", sub: "Awaiting action" },
          { label: "Total Citizens", val: stats.totalCitizens, color: "#8B5CF6", sub: "Registered" }
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: "20px", textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "var(--gray-400)", fontWeight: 700, textTransform: "uppercase" }}>{s.label}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: s.color, margin: "10px 0" }}>{s.val}</div>
            <div style={{ fontSize: 11, color: "var(--gray-300)" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 30 }}>
        <div className="card" style={{ padding: 25 }}>
          <div className="card-hd"><span className="card-title">Status Distribution</span></div>
          <div style={{ height: 300, display: "flex", justifyContent: "center" }}>
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="card" style={{ padding: 25 }}>
          <div className="card-hd"><span className="card-title">Category-wise Volume</span></div>
          <div style={{ height: 300 }}>
            <Bar data={barData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-hd">
          <span className="card-title">Department-wise Breakdown</span>
        </div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Category</th>
                <th>Count</th>
                <th>Impact</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(stats.categoryStats).map(([cat, count]) => (
                <tr key={cat}>
                  <td><strong>{cat}</strong></td>
                  <td>{count} complaints</td>
                  <td>
                    <div style={{ width: "100%", height: 6, background: "var(--gray-100)", borderRadius: 10 }}>
                      <div style={{ 
                        width: `${(count / (stats.totalComplaints || 1)) * 100}%`, 
                        height: "100%", background: "var(--blue)", borderRadius: 10 
                      }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}