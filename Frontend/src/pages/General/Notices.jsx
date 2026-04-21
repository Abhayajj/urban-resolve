// ─────────────────────────────────────────────
// PAGE: Notices
// Full notices page — shows all public announcements.
// No props needed.
// ─────────────────────────────────────────────

function Notices() {
    const notices = [
        {
            tag: "info", tagLabel: "Information",
            title: "New Portal Features — Photo Upload, GPS & SMS Tracking",
            body: "Citizens can now upload up to 5 photos, use GPS location pinning, and receive real-time SMS updates at every stage.",
            date: "10 Mar 2026 · IT Cell"
        },
        {
            tag: "update", tagLabel: "Update",
            title: "Roads & Infrastructure — Monthly Drive Completed",
            body: "142 potholes reported in Wards 3–8 have been patched as part of the March 2026 monthly civic drive.",
            date: "8 Mar 2026 · Roads & Infrastructure Department"
        },
        {
            tag: "warn", tagLabel: "Maintenance",
            title: "Portal Downtime — 20 March 2026, 12am–3am",
            body: "Scheduled server maintenance. Complaint submission unavailable. All pending requests processed automatically after restoration.",
            date: "13 Mar 2026 · IT Cell"
        },
    ];

    return (
        <div>
            {/* Page banner */}
            <div className="inner-hero">
                <div className="ih-tag">Notices</div>
                <div className="ih-title">Public Notices &amp; Announcements</div>
                <p className="ih-sub">Official communications from the Municipal Corporation and all departments.</p>
            </div>

            <div className="sec-wrap">
                <div className="sec-inner" style={{ maxWidth: 800, display: "flex", flexDirection: "column", gap: 14 }}>

                    {/* Featured urgent notice */}
                    <div style={{ background: "linear-gradient(135deg,var(--i1),var(--t1))", borderRadius: "var(--rl)", padding: 24, borderLeft: "4px solid var(--red)" }}>
                        <div style={{ background: "rgba(220,38,38,.3)", border: "1px solid rgba(220,38,38,.5)", color: "#FCA5A5", fontSize: 10, fontWeight: 700, textTransform: "uppercase", padding: "3px 9px", borderRadius: 99, display: "inline-block", marginBottom: 12 }}>
                            🔴 Urgent
                        </div>
                        <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
                            Water Supply Interruption — Wards 5, 6, 7
                        </div>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,.65)", lineHeight: 1.7 }}>
                            Scheduled pipeline maintenance on <strong style={{ color: "#fff" }}>17 March 2026 from 10am–2pm</strong>. Emergency tankers deployed at key points.
                        </p>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,.35)", marginTop: 10 }}>
                            14 Mar 2026 · Municipal Water Department
                        </div>
                    </div>

                    {/* Regular notices */}
                    {notices.map(({ tag, tagLabel, title, body, date }) => (
                        <div key={title} className="notice-small">
                            <div className={`ns-tag ${tag}`}>{tagLabel}</div>
                            <div className="ns-title">{title}</div>
                            <div className="ns-body">{body}</div>
                            <div className="ns-date">{date}</div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}

export default Notices;