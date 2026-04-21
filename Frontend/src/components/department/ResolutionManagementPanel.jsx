import React, { useState, useEffect } from "react";
import API_URL from '../../config.js';

export default function ResolutionManagementPanel({ activePanel, user }) {
  const [complaints, setComplaints] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [status, setStatus] = useState("Pending");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("dept_token");
        const res = await fetch(API_URL + "/complaints", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setComplaints(data);
          if (data.length > 0) {
            setSelectedId(data[0]._id);
            setStatus(data[0].status);
            setNotes(data[0].resolutionNotes || "");
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchComplaints();
  }, [activePanel]);

  const selectedComplaint = complaints.find(c => c._id === selectedId);

  const handleUpdate = async () => {
    if (!selectedId) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("dept_token");
      const res = await fetch(`${API_URL}/complaints/${selectedId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status, resolutionNotes: notes })
      });

      if (res.ok) {
        alert("Complaint updated successfully!");
        // Refresh local data
        setComplaints(prev => prev.map(c => c._id === selectedId ? { ...c, status, resolutionNotes: notes } : c));
      }
    } catch (err) {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`panel ${activePanel === "dp-resolve" ? "active" : ""}`} id="dp-resolve">
        <div className="page-intro">
          <h2>Resolution Management</h2>
          <p>Update complaint status and upload proof for {user?.departmentName}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 14 }}>
          <div>
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="form-group">
                <label className="form-label req">Select Complaint to Resolve</label>
                <select 
                  className="form-input" 
                  value={selectedId} 
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedId(id);
                    const comp = complaints.find(c => c._id === id);
                    if (comp) {
                      setStatus(comp.status);
                      setNotes(comp.resolutionNotes || "");
                    }
                  }}
                >
                  {complaints.map(c => (
                    <option key={c._id} value={c._id}>#{c._id.slice(-4)} - {c.title}</option>
                  ))}
                  {complaints.length === 0 && <option>No complaints assigned</option>}
                </select>
              </div>

              {selectedComplaint && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <span className="cid">#{selectedComplaint._id.slice(-4)}</span>
                    <span className={`badge ${selectedComplaint.status === "Pending" ? "b-pending" : selectedComplaint.status === "In Progress" ? "b-progress" : "b-resolved"}`}>
                      {selectedComplaint.status}
                    </span>
                  </div>

                  <div className="form-group">
                    <label className="form-label req">Change Status</label>
                    <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value)}>
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Resolved</option>
                      <option>Rejected</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label req">Resolution Notes</label>
                    <textarea
                      className="form-input"
                      rows={4}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Describe work done…"
                    />
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="btn btn-primary" onClick={handleUpdate} disabled={loading}>
                      {loading ? "Updating..." : "Update Status"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-hd">
              <span className="card-title">Complaint Info</span>
            </div>
            {selectedComplaint ? (
              <div style={{ fontSize: 13 }}>
                <p><strong>Location:</strong> {selectedComplaint.location}</p>
                <p><strong>Ward:</strong> {selectedComplaint.ward}</p>
                <p><strong>Filed On:</strong> {new Date(selectedComplaint.createdAt).toLocaleString()}</p>
                <hr style={{ border: "0", borderTop: "1px solid var(--gray-100)", margin: "10px 0" }} />
                <p><strong>Description:</strong> {selectedComplaint.description}</p>
              </div>
            ) : (
              <p style={{ fontSize: 13, color: "var(--gray-400)" }}>Select a complaint to see details</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}