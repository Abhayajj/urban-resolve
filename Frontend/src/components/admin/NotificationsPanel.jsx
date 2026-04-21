import React, { useState, useEffect } from "react";
import API_URL from '../../config.js';

export default function NotificationsPanel() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("All Citizens");
  const [priority, setPriority] = useState("Normal");
  const [ward, setWard] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(API_URL + "/notifications/all", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleSend = async () => {
    if (!title || !message) return alert("Please fill all fields");
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(API_URL + "/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, message, target, priority, ward })
      });
      const data = await res.json();
      if (data.success) {
        alert("Broadcast sent successfully!");
        setTitle("");
        setMessage("");
        fetchNotifications();
      } else {
        alert(data.message || "Failed to send");
      }
    } catch (err) {
      alert("Error sending notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel active" id="p-notifs">
      <div className="page-intro">
        <h2>Notifications & Announcements</h2>
        <p>Broadcast messages to citizens and departments</p>
      </div>

      <div className="grid-2">
        <div className="card" style={{ padding: 24 }}>
          <div className="card-hd"><span className="card-title">Broadcast New Announcement</span></div>
          
          <div className="form-group">
            <label className="form-label req">Target Audience</label>
            <select className="form-input" value={target} onChange={e => setTarget(e.target.value)}>
              <option>All Citizens</option>
              <option>All Departments</option>
              <option>Specific Ward</option>
            </select>
          </div>

          {target === "Specific Ward" && (
            <div className="form-group">
              <label className="form-label req">Ward Name</label>
              <input className="form-input" placeholder="e.g. Ward 7" value={ward} onChange={e => setWard(e.target.value)} />
            </div>
          )}

          <div className="form-group">
            <label className="form-label req">Priority Level</label>
            <select className="form-input" value={priority} onChange={e => setPriority(e.target.value)}>
              <option>Normal</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label req">Announcement Title</label>
            <input className="form-input" placeholder="e.g. Water Maintenance" value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label req">Detailed Message</label>
            <textarea className="form-input" rows="4" placeholder="Write your message here..." value={message} onChange={e => setMessage(e.target.value)} />
          </div>

          <button className="btn btn-primary" style={{ width: "100%", padding: 14 }} onClick={handleSend} disabled={loading}>
            {loading ? "Sending..." : "🚀 Send Broadcast"}
          </button>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div className="card-hd"><span className="card-title">Recent History</span></div>
          <div style={{ maxHeight: 500, overflowY: "auto" }}>
            {notifications.map(n => (
              <div key={n._id} className="announce" style={{ 
                padding: 15, borderRadius: 12, background: "#F8FAFC", marginBottom: 12, border: "1px solid #F1F5F9" 
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "var(--navy2)" }}>{n.title}</span>
                  <span className={`badge ${n.priority === 'Urgent' ? 'b-pending' : n.priority === 'High' ? 'b-progress' : 'b-resolved'}`}>
                    {n.priority}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.5, marginBottom: 8 }}>{n.message}</div>
                <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 700 }}>
                  📅 {new Date(n.createdAt).toLocaleDateString()} · 🎯 {n.target} {n.ward ? `(${n.ward})` : ''}
                </div>
              </div>
            ))}
            {notifications.length === 0 && <p style={{ textAlign: "center", color: "#94A3B8" }}>No past announcements</p>}
          </div>
        </div>
      </div>
    </div>
  );
}