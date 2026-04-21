import React, { useState, useEffect } from "react";

function ComplaintsPanel() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("admin_token");
        const res = await fetch("http://localhost:5000/api/v1/complaints", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setComplaints(data);
          setFiltered(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  useEffect(() => {
    let data = [...complaints];
    if (statusFilter !== "All Status") {
      data = data.filter(c => c.status === statusFilter);
    }
    if (search.trim() !== "") {
      data = data.filter(c => 
        c.title.toLowerCase().includes(search.toLowerCase()) || 
        c.ward.toLowerCase().includes(search.toLowerCase()) ||
        c._id.includes(search)
      );
    }
    setFiltered(data);
  }, [search, statusFilter, complaints]);

  const handleExportCSV = () => {
    if (filtered.length === 0) return alert("No data to export");
    const headers = "ID,Title,Category,Ward,Status,Date\n";
    const rows = filtered.map(c => 
      `${c._id},"${c.title}",${c.category},${c.ward},${c.status},${new Date(c.createdAt).toLocaleDateString()}`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `urban_resolve_complaints_${Date.now()}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending": return "b-pending";
      case "In Progress": return "b-progress";
      case "Resolved": return "b-resolved";
      default: return "b-pending";
    }
  };

  return (
    <div className="panel active" id="p-complaints">
      <div className="page-intro">
        <h2 style={{ fontSize: 24, fontWeight: 800 }}>Complaint Monitoring</h2>
        <p style={{ color: "#64748B" }}>Track and manage all filed complaints</p>
      </div>

      <div className="card" style={{ marginBottom: 14, borderRadius: 16 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", padding: 8 }}>
          <div className="search-inner" style={{ flex: 1, minWidth: 200, position: "relative" }}>
            <input 
              className="form-input"
              placeholder="Search ID, title, ward…" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 40, borderRadius: 12 }}
            />
            <span style={{ position: "absolute", left: 14, top: 12, opacity: 0.4 }}>🔍</span>
          </div>

          <select 
            className="form-input" 
            style={{ width: 150, borderRadius: 12 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>

          <button 
            className="btn btn-primary" 
            style={{ borderRadius: 12 }}
            onClick={() => window.dispatchEvent(new CustomEvent('changePanel', {detail: 'assign'}))}
          >
            + Assign Complaints
          </button>
        </div>
      </div>

      <div className="card" style={{ borderRadius: 20, overflow: "hidden" }}>
        <div className="card-hd" style={{ padding: "20px 24px", borderBottom: "1px solid #F1F5F9" }}>
          <span className="card-title">Live Complaints Database ({filtered.length})</span>
          <button className="btn btn-ghost btn-sm" onClick={handleExportCSV}>📂 Export CSV</button>
        </div>

        <div className="tbl-wrap">
          <table className="tbl">
            <thead style={{ background: "#F8FAFC" }}>
              <tr>
                <th style={{ padding: "16px 20px" }}>ID</th>
                <th>Issue</th>
                <th>Category</th>
                <th>Location</th>
                <th>Priority</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" style={{ textAlign: "center", padding: 40 }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="8" style={{ textAlign: "center", padding: 40 }}>No complaints found</td></tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c._id}>
                    <td style={{ padding: "16px 20px" }}><span className="cid">#{c._id.slice(-6).toUpperCase()}</span></td>
                    <td><div style={{ fontWeight: 600 }}>{c.title}</div></td>
                    <td>{c.category}</td>
                    <td>{c.ward}</td>
                    <td>
                        <span style={{ 
                            fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 6,
                            background: c.priority === "High" ? "#FEE2E2" : "#ECFDF5",
                            color: c.priority === "High" ? "#DC2626" : "#059669"
                        }}>
                            {c.priority || "Medium"}
                        </span>
                    </td>
                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td><span className={`badge ${getStatusClass(c.status)}`}>{c.status}</span></td>
                    <td><button className="btn btn-ghost btn-sm">Manage</button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ComplaintsPanel;