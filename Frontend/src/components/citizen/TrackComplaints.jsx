import React, { useState, useEffect } from "react";

export default function TrackComplaints({ activePanel }) {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activePanel !== "cp-track") return;

    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("citizen_token");
        const res = await fetch("http://localhost:5000/api/v1/complaints/my", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setComplaints(data.data);
          if (data.data.length > 0) {
            setSelectedComplaint(data.data[0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [activePanel]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending": return "b-pending";
      case "In Progress": return "b-progress";
      case "Resolved": return "b-resolved";
      default: return "b-pending";
    }
  };

  const getProgressWidth = (status) => {
    switch (status) {
      case "Pending": return "20%";
      case "In Progress": return "60%";
      case "Resolved": return "100%";
      default: return "0%";
    }
  };

  return (
    <>
      {/* ═══ TRACK COMPLAINTS ═══ */}
      <div
        className={`panel ${activePanel === "cp-track" ? "active" : ""}`}
        id="cp-track"
      >
        <div className="page-intro">
          <h2>Track Complaints</h2>
          <p>Live progress and timeline for your filed complaints</p>
        </div>

        {loading ? (
          <p>Loading complaints...</p>
        ) : complaints.length === 0 ? (
          <p>No complaints found.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 14 }}>
            {/* LEFT SIDE */}
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--gray-300)",
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  marginBottom: 10
                }}
              >
                Select Complaint
              </div>

              {complaints.map((c) => (
                <div
                  key={c._id}
                  onClick={() => setSelectedComplaint(c)}
                  style={{
                    border: selectedComplaint?._id === c._id ? "2px solid var(--blue)" : "1px solid var(--gray-200)",
                    background: selectedComplaint?._id === c._id ? "var(--sky)" : "#fff",
                    borderRadius: 12,
                    padding: 14,
                    marginBottom: 8,
                    cursor: "pointer"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                    <span className="cid">#{c._id.slice(-4)}</span>
                    <span className={`badge ${getStatusClass(c.status)}`}>{c.status}</span>
                  </div>

                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--gray-900)" }}>
                    {c.title}
                  </div>

                  <div style={{ fontSize: 11, color: "var(--gray-400)", marginTop: 3 }}>
                    {c.ward} · {new Date(c.createdAt).toLocaleDateString()}
                  </div>

                  <div style={{ marginTop: 8 }}>
                    <div style={{ height: 4, background: "var(--gray-200)", borderRadius: 99 }}>
                      <div
                        style={{
                          width: getProgressWidth(c.status),
                          height: "100%",
                          background: c.status === "Resolved" ? "var(--green)" : "var(--blue)",
                          borderRadius: 99
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT SIDE */}
            {selectedComplaint && (
              <div>
                <div className="card" style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      marginBottom: 14
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          flexWrap: "wrap",
                          marginBottom: 8
                        }}
                      >
                        <span className="cid">#{selectedComplaint._id.slice(-4)}</span>
                        <span className={`badge ${getStatusClass(selectedComplaint.status)}`}>{selectedComplaint.status}</span>
                      </div>

                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 15,
                          fontWeight: 700,
                          color: "var(--gray-900)",
                          marginBottom: 5
                        }}
                      >
                        {selectedComplaint.title} — {selectedComplaint.ward}
                      </div>

                      <div
                        style={{
                          fontSize: 13,
                          color: "var(--gray-500)",
                          lineHeight: "1.6"
                        }}
                      >
                        {selectedComplaint.description}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline + Dept Message */}
                <div className="grid-2">
                  <div className="card">
                    <div className="card-hd">
                      <span className="card-title">Complaint Timeline</span>
                    </div>

                    <div className="timeline">
                      <div className="tl-item">
                        <div className="tl-left">
                          <div className="tl-dot done">✓</div>
                          <div className="tl-line" />
                        </div>
                        <div className="tl-body">
                          <div className="tl-title">Complaint Submitted</div>
                          <div className="tl-desc">Logged with ID #{selectedComplaint._id.slice(-4)}</div>
                          <div className="tl-time">📅 {new Date(selectedComplaint.createdAt).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-hd">
                      <span className="card-title">Dept Message</span>
                    </div>
                    {selectedComplaint.status !== "Pending" ? (
                      <div
                        style={{
                          background: "var(--sky)",
                          border: "1px solid var(--sky2)",
                          borderRadius: 10,
                          padding: 13
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                          <div
                            className="user-av amber"
                            style={{ width: 24, height: 24, fontSize: 9, borderRadius: 7 }}
                          >
                            DP
                          </div>
                          <div style={{ fontSize: 12, fontWeight: 700 }}>
                            Department Assigned
                          </div>
                        </div>
                        <p
                          style={{
                            fontSize: 13,
                            color: "var(--navy2)",
                            lineHeight: "1.6",
                            fontStyle: "italic"
                          }}
                        >
                          "Your complaint is being looked into by the concerned department."
                        </p>
                      </div>
                    ) : (
                      <p style={{ fontSize: 12, color: "var(--gray-400)" }}>No messages yet. Waiting for assignment.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}