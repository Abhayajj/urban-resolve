// ─────────────────────────────────────────────
// COMPONENT: NoticesPreview
// Shows a preview of notices on the Home page (not the full Notices page).
// Props: setPage — used for "View All" button
// ─────────────────────────────────────────────

function NoticesPreview({ setPage }) {
    const smallNotices = [
        {
            tag: "info", tagLabel: "Information",
            title: "New Portal Features Live",
            body: "Photo upload (5 images), GPS location, real-time SMS tracking, and department messaging now available.",
            date: "10 Mar 2026 · IT Cell"
        },
        {
            tag: "update", tagLabel: "Update",
            title: "Roads Drive Completed — Wards 3–8",
            body: "142 reported potholes patched as part of the March 2026 monthly civic improvement drive.",
            date: "8 Mar 2026 · Roads Dept"
        },
        {
            tag: "warn", tagLabel: "Maintenance",
            title: "Portal Downtime — 20 March, 12am–3am",
            body: "Scheduled server maintenance. All requests processed after restoration.",
            date: "13 Mar 2026 · IT Cell"
        },
    ];

    return (
        <div className="sec-wrap" style={{ background: "var(--g50)" }}>
            <div className="sec-inner">

                {/* Header */}
                <div className="sec-header">
                    <div>
                        <div className="sec-eyebrow">📢 Announcements</div>
                        <h2 className="sec-title">Latest <em>Notices</em></h2>
                    </div>
                    <button
                        onClick={() => setPage("notices")}
                        style={{ padding: "9px 18px", background: "transparent", border: "1.5px solid var(--g200)", color: "var(--g600)", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                    >
                        View All →
                    </button>
                </div>

                <div className="notices-layout">

                    {/* Featured urgent notice (left, tall) */}
                    <div className="notice-featured">
                        <div className="nf-tag">🔴 Urgent Notice</div>
                        <div className="nf-title">Water Supply Interruption — Wards 5, 6, 7</div>
                        <div className="nf-body">
                            Scheduled pipeline maintenance on <strong style={{ color: "#fff" }}>17 March 2026 from 10am–2pm</strong>.
                            All residents in Wards 5, 6, and 7 should store adequate water.
                        </div>
                        <div className="nf-date">14 Mar 2026 · Municipal Water Dept</div>
                    </div>

                    {/* Smaller notices (right column) */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {smallNotices.map(({ tag, tagLabel, title, body, date }) => (
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
        </div>
    );
}

export default NoticesPreview;