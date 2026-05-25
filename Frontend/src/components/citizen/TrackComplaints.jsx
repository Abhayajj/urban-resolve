import React, { useState, useEffect } from "react";
import API_URL from '../../config.js';

export default function TrackComplaints({ activePanel }) {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDownloadReceipt = (c) => {
    const printWindow = window.open("", "_blank");
    const citizenData = JSON.parse(localStorage.getItem("citizen_data") || "{}");
    const name = citizenData.firstName ? `${citizenData.firstName} ${citizenData.lastName}` : "Registered Citizen";
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://urbanresolve.gov.in/track/${c._id}`;

    printWindow.document.write(`
      <html>
        <head>
          <title>Grievance Receipt - ${c._id}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
            .receipt-box { border: 2px solid #333; padding: 25px; border-radius: 8px; position: relative; }
            .header-strip { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 20px; }
            .tricolor { display: flex; height: 4px; margin-bottom: 10px; }
            .logo-sec { display: flex; align-items: center; gap: 10px; }
            .logo-mark { font-size: 28px; }
            .gov-text { font-size: 11px; font-weight: 800; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
            .title { text-align: center; font-size: 18px; font-weight: 800; margin: 15px 0 5px; color: #111; letter-spacing: 0.5px; }
            .subtitle { text-align: center; font-size: 11px; color: #555; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.5px; }
            .details-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
            .details-table td { padding: 10px; border: 1px solid #ddd; font-size: 13px; }
            .details-table td.label { font-weight: 700; background: #f9f9f9; width: 30%; }
            .footer-sec { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 30px; border-top: 1px dashed #ccc; padding-top: 15px; }
            .qr-code { width: 100px; height: 100px; }
            .seal-sec { text-align: right; font-size: 11px; color: #555; }
            .stamp { border: 2px double #16A34A; color: #16A34A; display: inline-block; padding: 5px 12px; font-weight: 800; font-size: 12px; text-transform: uppercase; border-radius: 4px; transform: rotate(-5deg); margin-bottom: 10px; }
            .print-btn { display: block; margin: 20px auto 0; padding: 10px 20px; background: #2563EB; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
            @media print { .print-btn { display: none; } }
          </style>
        </head>
        <body>
          <div class="tricolor">
            <div style="background: #FF9933; flex: 1;"></div>
            <div style="background: #FFFFFF; flex: 1;"></div>
            <div style="background: #138808; flex: 1;"></div>
          </div>
          <div class="receipt-box">
            <div class="header-strip">
              <div class="logo-sec">
                <span class="logo-mark">🇮🇳</span>
                <div>
                  <div class="gov-text">Ministry of Housing and Urban Affairs</div>
                  <div style="font-size: 13px; font-weight: 700;">Government of India | State Grievance Registry</div>
                </div>
              </div>
              <div style="font-size: 11px; font-weight: 700; background: #e5e7eb; padding: 4px 8px; border-radius: 4px;">
                TRACKING ID: GR-${c._id.slice(-6).toUpperCase()}
              </div>
            </div>
            
            <div class="title">OFFICIAL GRIEVANCE REDRESSAL RECORD</div>
            <div class="subtitle">MUNICIPAL CORPORATION grievance acknowledgement report</div>
            
            <table class="details-table">
              <tr>
                <td class="label">Citizen Name</td>
                <td>${name}</td>
              </tr>
              <tr>
                <td class="label">Date Filed</td>
                <td>${new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td class="label">Category</td>
                <td>${c.category} - ${c.subCategory || "General"}</td>
              </tr>
              <tr>
                <td class="label">Ward & Location</td>
                <td>${c.ward} (${c.location})</td>
              </tr>
              <tr>
                <td class="label">Grievance Title</td>
                <td><strong>${c.title}</strong></td>
              </tr>
              <tr>
                <td class="label">Description</td>
                <td>${c.description}</td>
              </tr>
              <tr>
                <td class="label">Current Status</td>
                <td><strong>${c.status.toUpperCase()}</strong></td>
              </tr>
              <tr>
                <td class="label">Resolution Details</td>
                <td>${c.resolutionNotes || "Redressal actions are currently in progress. Updates will be broadcasted online."}</td>
              </tr>
            </table>

            <div class="footer-sec">
              <div>
                <img class="qr-code" src="${qrUrl}" alt="Verification QR Code" />
                <div style="font-size: 9px; color: #777; margin-top: 5px;">Scan QR to track status online.</div>
              </div>
              <div class="seal-sec">
                <div class="stamp">Urban Resolve e-Verified</div>
                <div style="font-weight: 700;">DIGITALLY SIGNED E-PORTAL DIVISION</div>
                <div style="font-size: 10px; color: #777;">Aadhaar gateway e-stamp verified.</div>
              </div>
            </div>
          </div>
          <button class="print-btn" onclick="window.print()">Print Grievance Ticket</button>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  useEffect(() => {
    if (activePanel !== "cp-track") return;

    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("citizen_token");
        const res = await fetch(API_URL + "/complaints/my", {
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
                        <button 
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleDownloadReceipt(selectedComplaint)}
                          style={{ marginLeft: "auto", fontSize: 11, padding: "3px 10px", borderColor: "var(--blue)" }}
                        >
                          📄 Download Receipt
                        </button>
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