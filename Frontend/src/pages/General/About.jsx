// ─────────────────────────────────────────────
// PAGE: About
// Static page — no components needed, content is simple enough to write here.
// No props needed.
// ─────────────────────────────────────────────

function About() {
    const zones = [
        { color: "#FCA5A5", label: "Admin Zone", desc: "Full control, analytics, management" },
        { color: "#FDE68A", label: "Dept Zone", desc: "Complaint handling and resolution" },
        { color: "#86EFAC", label: "Citizen Zone", desc: "File, track and give feedback" },
        { color: "#7DD3FC", label: "General Zone", desc: "This public information portal" },
    ];

    return (
        <div>
            {/* Page banner */}
            <div className="inner-hero">
                <div className="ih-tag">About Us</div>
                <div className="ih-title">Urban Resolve Portal</div>
                <p className="ih-sub">
                    A final year engineering project demonstrating production-grade complaint automation
                    for modern urban governance.
                </p>
            </div>

            {/* Content */}
            <div className="sec-wrap">
                <div className="sec-inner" style={{ maxWidth: 900 }}>

                    {/* Two info cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
                        <div style={{ background: "#fff", border: "1px solid var(--g100)", borderRadius: "var(--rl)", padding: 24 }}>
                            <div className="sec-eyebrow" style={{ marginBottom: 12 }}>Mission</div>
                            <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 800, color: "var(--g900)", marginBottom: 10 }}>
                                Why we built this
                            </h3>
                            <p style={{ fontSize: 13, color: "var(--g500)", lineHeight: 1.8 }}>
                                Traditional complaint systems are slow and opaque. Urban Resolve automates routing,
                                tracks resolution in real time, and brings accountability to every department.
                            </p>
                        </div>
                        <div style={{ background: "#fff", border: "1px solid var(--g100)", borderRadius: "var(--rl)", padding: 24 }}>
                            <div className="sec-eyebrow" style={{ marginBottom: 12 }}>Technology</div>
                            <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 800, color: "var(--g900)", marginBottom: 10 }}>
                                Built with modern tools
                            </h3>
                            <p style={{ fontSize: 13, color: "var(--g500)", lineHeight: 1.8 }}>
                                MERN Stack · React · Node.js · Express · MongoDB · JWT Auth ·
                                Responsive Design · Role-based Access Control · Real-time notifications.
                            </p>
                        </div>
                    </div>

                    {/* System zones panel */}
                    <div style={{ background: "linear-gradient(135deg,var(--i1),var(--t1))", borderRadius: "var(--rl)", padding: 28 }}>
                        <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 18 }}>
                            System Zones
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                            {zones.map(({ color, label, desc }) => (
                                <div key={label} style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 10, padding: 16 }}>
                                    <div style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 6 }}>{label}</div>
                                    <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}>{desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default About;