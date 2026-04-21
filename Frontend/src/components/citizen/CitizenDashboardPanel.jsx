import React, { useState, useEffect } from "react";

export default function CitizenDashboardPanel({ setActivePanel, user }) {
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
    if (user) {
      fetchComplaints();
    } else {
      setLoading(false);
    }
  }, [user]);

  const pending = complaints.filter(c => c.status === "Pending").length;
  const inProgress = complaints.filter(c => c.status === "In Progress").length;
  const resolved = complaints.filter(c => c.status === "Resolved" || c.status === "Completed").length;
  const total = complaints.length;

  return (
    <>
      {/* ═══ CITIZEN DASHBOARD ═══ */}
      <div className="panel active" id="cp-dash" style={{ display: "block" }}>
        
        <div className="page-intro">
          <h2>Welcome, {user?.firstName || "Citizen"}!</h2>
          <p>Overview of your submitted complaints</p>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg,var(--navy2),var(--blue2))",
            borderRadius: 14,
            padding: "18px 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
            flexWrap: "wrap",
            gap: 10
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                marginBottom: 3
              }}
            >
              Have a civic issue to report?
            </div>

            <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)" }}>
              File a complaint in under 2 minutes
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn"
              style={{ background: "#fff", color: "var(--navy2)" }}
              onClick={() => setActivePanel("cp-file")}
            >
              + File Complaint
            </button>

            <button
              className="btn"
              style={{
                background: "rgba(255,255,255,.15)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,.3)"
              }}
              onClick={() => setActivePanel("cp-track")}
            >
              Track Status
            </button>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="stat-grid four">

          <div className="stat-card sc-blue">
            <div className="stat-icon" style={{ background: "var(--sky)" }}>
              <svg width={19} height={19} fill="none" stroke="var(--blue)" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              </svg>
            </div>
            <div className="stat-lbl">Total Filed</div>
            <div className="stat-val">{loading ? "-" : total}</div>
            <div className="stat-trend neu">All time</div>
          </div>

          <div className="stat-card sc-amber">
            <div className="stat-icon" style={{ background: "var(--amber-bg)" }}>
              <svg width={19} height={19} fill="none" stroke="var(--amber)" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx={12} cy={12} r={10} />
              </svg>
            </div>
            <div className="stat-lbl">Pending</div>
            <div className="stat-val">{loading ? "-" : pending}</div>
            <div className="stat-trend dn">Awaiting action</div>
          </div>

          <div className="stat-card sc-blue">
            <div className="stat-icon" style={{ background: "var(--sky)" }}>
              <svg width={19} height={19} fill="none" stroke="var(--blue)" strokeWidth={2} viewBox="0 0 24 24">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <div className="stat-lbl">In Progress</div>
            <div className="stat-val">{loading ? "-" : inProgress}</div>
            <div className="stat-trend up">Being worked on</div>
          </div>

          <div className="stat-card sc-green">
            <div className="stat-icon" style={{ background: "var(--green-bg)" }}>
              <svg width={19} height={19} fill="none" stroke="var(--green)" strokeWidth={2} viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="stat-lbl">Resolved</div>
            <div className="stat-val">{loading ? "-" : resolved}</div>
            <div className="stat-trend up">
              {total > 0 ? `▲ ${Math.round((resolved/total)*100)}% rate` : "No data"}
            </div>
          </div>

        </div>

        {/* RECENT COMPLAINTS + NOTIFICATIONS */}

        <div className="grid-2">

          <div className="card">
            <div className="card-hd">
              <span className="card-title">Recent Complaints</span>
              <span
                className="card-action"
                onClick={() => setActivePanel("cp-history")}
              >
                View all →
              </span>
            </div>

            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Filed</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>Loading...</td>
                    </tr>
                  ) : complaints.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>No complaints found.</td>
                    </tr>
                  ) : (
                    complaints.slice(0, 5).map((c) => {
                      let statusClass = "b-pending";
                      if (c.status === "In Progress") statusClass = "b-progress";
                      if (c.status === "Resolved" || c.status === "Completed") statusClass = "b-resolved";
                      
                      return (
                        <tr key={c._id}>
                          <td><span className="cid">#{c._id.slice(-4).toUpperCase()}</span></td>
                          <td>{c.category}</td>
                          <td>{c.location}</td>
                          <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                          <td><span className={`badge ${statusClass}`}>{c.status}</span></td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-hd">
              <span className="card-title">Latest Notifications</span>
            </div>

            <div className="act-item">
              <div className="act-dot" style={{ background: "var(--amber)" }} />
              <div>
                <div className="act-text">Welcome to the Urban Resolve Portal!</div>
                <div className="act-time">Just now</div>
              </div>
            </div>

            {complaints.length > 0 && complaints[0].status !== "Pending" && (
               <div className="act-item">
                 <div className="act-dot" style={{ background: "var(--green)" }} />
                 <div>
                   <div className="act-text">
                     Complaint <strong>#{complaints[0]._id.slice(-4).toUpperCase()}</strong> is now <strong>{complaints[0].status}</strong>
                   </div>
                   <div className="act-time">Recently</div>
                 </div>
               </div>
            )}

          </div>

        </div>

      </div>
    </>
  );
}