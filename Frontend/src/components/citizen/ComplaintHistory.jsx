import React, { useState, useEffect } from "react";

export default function ComplaintHistory({ setActivePanel }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("citizen_token");
        const res = await fetch("http://localhost:5000/api/v1/complaints/my", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setComplaints(data.data);
        }
      } catch (error) {
        console.error("Error fetching complaints", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending": return "b-pending";
      case "In Progress": return "b-progress";
      case "Resolved": return "b-resolved";
      case "Completed": return "b-resolved";
      default: return "b-pending";
    }
  };

  return (
    <>
      <div className="panel active" id="cp-history" style={{ display: "block" }}>
        <div className="page-intro">
          <h2>Complaint History</h2>
          <p>All your filed complaints — track progress in real-time</p>
        </div>

        <div className="card" style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div className="search-inner" style={{ flex: 1, minWidth: 180 }}>
              <input placeholder="Search ID, category…" />
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setActivePanel("cp-file")}>
              + New Complaint
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-hd">
            <span className="card-title">All Complaints ({complaints.length})</span>
          </div>

          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title / Category</th>
                  <th>Location</th>
                  <th>Filed On</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>Loading...</td></tr>
                ) : complaints.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>No complaints found.</td></tr>
                ) : (
                  complaints.map((c) => (
                    <tr key={c._id}>
                      <td><span className="cid">#{c._id.slice(-4).toUpperCase()}</span></td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{c.title}</div>
                        <div style={{ fontSize: 11, color: "var(--gray-400)" }}>{c.category}</div>
                      </td>
                      <td>{c.location}</td>
                      <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td><span className={`badge ${getStatusClass(c.status)}`}>{c.status}</span></td>
                      <td>
                        <button className="btn btn-ghost btn-sm" onClick={() => setActivePanel("cp-track")}>
                          Track
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}