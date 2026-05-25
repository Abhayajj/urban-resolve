import React, { useState, useEffect } from "react";
import API_URL from '../../config.js';

export default function CitizenDashboardPanel({ setActivePanel, user, lang = "EN" }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("citizen_token");
        const res = await fetch(API_URL + "/complaints/my", {
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

  const t = {
    EN: {
      welcome: "Welcome",
      sub: "Overview of your submitted complaints",
      bannerTitle: "Have a civic issue to report?",
      bannerSub: "File a complaint in under 2 minutes",
      btnFile: "+ File Complaint",
      btnTrack: "Track Status",
      total: "Total Filed",
      allTime: "All time",
      pending: "Pending",
      awaiting: "Awaiting action",
      progress: "In Progress",
      beingWorked: "Being worked on",
      resolved: "Resolved",
      recentComplaints: "Recent Complaints",
      viewAll: "View all →",
      latestNotifs: "Latest Notifications",
      tableId: "ID",
      tableCat: "Category",
      tableLoc: "Location",
      tableFiled: "Filed",
      tableStatus: "Status",
      loading: "Loading...",
      noComplaints: "No complaints found.",
      welcomeNotif: "Welcome to the Urban Resolve Portal!"
    },
    HI: {
      welcome: "स्वागत है",
      sub: "आपके द्वारा दर्ज की गई शिकायतों का विवरण",
      bannerTitle: "कोई नागरिक समस्या दर्ज करनी है?",
      bannerSub: "2 मिनट से भी कम समय में शिकायत दर्ज करें",
      btnFile: "+ शिकायत दर्ज करें",
      btnTrack: "स्थिति ट्रैक करें",
      total: "कुल दर्ज",
      allTime: "हर समय",
      pending: "लंबित",
      awaiting: "कार्रवाई की प्रतीक्षा",
      progress: "प्रगति पर",
      beingWorked: "काम चल रहा है",
      resolved: "सुलझाया गया",
      recentComplaints: "हालिया शिकायतें",
      viewAll: "सभी देखें →",
      latestNotifs: "नवीनतम सूचनाएं",
      tableId: "आईडी",
      tableCat: "श्रेणी",
      tableLoc: "स्थान",
      tableFiled: "दर्ज तिथि",
      tableStatus: "स्थिति",
      loading: "लोड हो रहा है...",
      noComplaints: "कोई शिकायत नहीं मिली।",
      welcomeNotif: "अर्बन रिज़ॉल्यूशन पोर्टल पर आपका स्वागत है!"
    }
  }[lang];

  return (
    <>
      {/* ═══ CITIZEN DASHBOARD ═══ */}
      <div className="panel active" id="cp-dash" style={{ display: "block" }}>
        
        <div className="page-intro">
          <h2>{t.welcome}, {user?.firstName || "Citizen"}!</h2>
          <p>{t.sub}</p>
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
              {t.bannerTitle}
            </div>

            <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)" }}>
              {t.bannerSub}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn"
              style={{ background: "#fff", color: "var(--navy2)" }}
              onClick={() => setActivePanel("cp-file")}
            >
              {t.btnFile}
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
              {t.btnTrack}
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
            <div className="stat-lbl">{t.total}</div>
            <div className="stat-val">{loading ? "-" : total}</div>
            <div className="stat-trend neu">{t.allTime}</div>
          </div>

          <div className="stat-card sc-amber">
            <div className="stat-icon" style={{ background: "var(--amber-bg)" }}>
              <svg width={19} height={19} fill="none" stroke="var(--amber)" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx={12} cy={12} r={10} />
              </svg>
            </div>
            <div className="stat-lbl">{t.pending}</div>
            <div className="stat-val">{loading ? "-" : pending}</div>
            <div className="stat-trend dn">{t.awaiting}</div>
          </div>

          <div className="stat-card sc-blue">
            <div className="stat-icon" style={{ background: "var(--sky)" }}>
              <svg width={19} height={19} fill="none" stroke="var(--blue)" strokeWidth={2} viewBox="0 0 24 24">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <div className="stat-lbl">{t.progress}</div>
            <div className="stat-val">{loading ? "-" : inProgress}</div>
            <div className="stat-trend up">{t.beingWorked}</div>
          </div>

          <div className="stat-card sc-green">
            <div className="stat-icon" style={{ background: "var(--green-bg)" }}>
              <svg width={19} height={19} fill="none" stroke="var(--green)" strokeWidth={2} viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="stat-lbl">{t.resolved}</div>
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
              <span className="card-title">{t.recentComplaints}</span>
              <span
                className="card-action"
                onClick={() => setActivePanel("cp-history")}
              >
                {t.viewAll}
              </span>
            </div>

            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>{t.tableId}</th>
                    <th>{t.tableCat}</th>
                    <th>{t.tableLoc}</th>
                    <th>{t.tableFiled}</th>
                    <th>{t.tableStatus}</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>{t.loading}</td>
                    </tr>
                  ) : complaints.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>{t.noComplaints}</td>
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
              <span className="card-title">{t.latestNotifs}</span>
            </div>

            <div className="act-item">
              <div className="act-dot" style={{ background: "var(--amber)" }} />
              <div>
                <div className="act-text">{t.welcomeNotif}</div>
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