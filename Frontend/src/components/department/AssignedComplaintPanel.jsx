import React, { useEffect, useState } from "react";
import API_URL from '../../config.js';

export default function AssignedComplaintsPanel({ activePanel, user }) {

  const [complaints, setComplaints] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Resolution Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [resNotes, setResNotes] = useState("");

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("dept_token");
      const res = await fetch(API_URL + "/complaints", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        setComplaints([]);
        return;
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        setComplaints(data);
      } else {
        setComplaints([]);
      }
    } catch (err) {
      setComplaints([]);
    }
  };
  
  useEffect(() => {
    let data = [...complaints];
    if (statusFilter !== "All") {
      data = data.filter(c => c.status === statusFilter);
    }
    if (search.trim() !== "") {
      data = data.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.location.toLowerCase().includes(search.toLowerCase()) ||
        c._id.includes(search)
      );
    }
    setFiltered(data);
  }, [search, statusFilter, complaints]);

  const updateStatus = async (id, newStatus, notes = "") => {
    try {
      setLoadingId(id);
      const token = localStorage.getItem("dept_token");

      const res = await fetch(`${API_URL}/complaints/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
            status: newStatus,
            resolutionNotes: notes 
        })
      });

      if (!res.ok) throw new Error("Update failed");
      
      // Update local state
      setComplaints(prev => prev.map(c => c._id === id ? { ...c, status: newStatus, resolutionNotes: notes } : c));
      setShowModal(false);
      setResNotes("");

    } catch (err) {
      alert("Failed to update status");
      fetchComplaints();
    } finally {
      setLoadingId(null);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className={`panel ${activePanel === "dp-complaints" ? "active" : ""}`}>

      <div className="page-intro">
        <h2 style={{ fontSize: 24, fontWeight: 800 }}>Assigned Complaints</h2>
        <p style={{ color: "#64748B" }}>Official task queue for {user?.departmentName || "Department"}</p>
      </div>

      <div className="card" style={{ marginBottom: 14, borderRadius: 16 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", padding: 8 }}>
          <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
            <input
              className="form-input"
              placeholder="Search ID, Issue or Location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 40, borderRadius: 12 }}
            />
            <span style={{ position: "absolute", left: 14, top: 12, opacity: 0.4 }}>🔍</span>
          </div>

          <select
            className="form-input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: 150, borderRadius: 12, cursor: "pointer" }}
          >
            <option>All</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ borderRadius: 20, overflow: "hidden" }}>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead style={{ background: "#F8FAFC" }}>
              <tr>
                <th style={{ padding: "16px 20px" }}>Complaint ID</th>
                <th>Priority</th>
                <th>Issue Details</th>
                <th>Location</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((c) => (
                <tr key={c._id}>
                  <td style={{ padding: "16px 20px" }}>
                    <span style={{ fontFamily: "monospace", background: "#F1F5F9", padding: "4px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                        #{c._id.slice(-6).toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                        fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 6,
                        background: c.priority === "High" ? "#FEE2E2" : c.priority === "Medium" ? "#FEF3C7" : "#ECFDF5",
                        color: c.priority === "High" ? "#DC2626" : c.priority === "Medium" ? "#D97706" : "#059669"
                    }}>
                        {c.priority || "Medium"}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: "#0F172A" }}>{c.title}</div>
                    <div style={{ fontSize: 11, color: "#64748B" }}>{c.category} › {c.subCategory}</div>
                  </td>
                  <td>{c.location}</td>
                  <td>
                    <span className={`badge ${
                      c.status === "Pending" ? "b-pending" : c.status === "In Progress" ? "b-progress" : "b-resolved"
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td>
                    {c.status === "Pending" && (
                      <button className="btn btn-primary btn-sm" style={{ borderRadius: 8 }} onClick={() => updateStatus(c._id, "In Progress")} disabled={loadingId === c._id}>
                        {loadingId === c._id ? "..." : "Start Work"}
                      </button>
                    )}
                    {c.status === "In Progress" && (
                      <button className="btn btn-success btn-sm" style={{ borderRadius: 8, background: "#10B981" }} onClick={() => { setSelectedId(c._id); setShowModal(true); }}>
                        Resolve
                      </button>
                    )}
                    {c.status === "Resolved" && (
                      <button className="btn btn-ghost btn-sm" title={c.resolutionNotes}>View Notes</button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: "center", padding: 40, color: "#94A3B8" }}>No complaints matching your filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RESOLUTION MODAL */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }}>
            <div className="card" style={{ width: 450, padding: 30, borderRadius: 24, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
                <h3 style={{ marginBottom: 10, fontSize: 18, fontWeight: 800 }}>Resolve Complaint</h3>
                <p style={{ fontSize: 13, color: "#64748B", marginBottom: 20 }}>Please provide details about how the issue was resolved.</p>
                
                <label className="form-label">Resolution Notes</label>
                <textarea 
                    className="form-input" 
                    rows={4} 
                    placeholder="Enter what actions were taken..." 
                    value={resNotes}
                    onChange={(e) => setResNotes(e.target.value)}
                    style={{ marginBottom: 20, borderRadius: 12 }}
                />
                
                <div style={{ display: "flex", gap: 10 }}>
                    <button 
                        className="btn btn-primary" 
                        style={{ flex: 1, background: "#10B981" }}
                        onClick={() => updateStatus(selectedId, "Resolved", resNotes)}
                        disabled={loadingId === selectedId}
                    >
                        {loadingId === selectedId ? "Saving..." : "Mark as Resolved"}
                    </button>
                    <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}