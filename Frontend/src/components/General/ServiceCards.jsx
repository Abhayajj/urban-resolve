// ─────────────────────────────────────────────
// COMPONENT: ServiceCards
// Shows the 6 colourful service category cards (Water, Electricity, etc.)
// Props: setPage — to go to Register when "File a Complaint" is clicked
// ─────────────────────────────────────────────

// Small reusable arrow icon used on each card
const ArrowIcon = () => (
    <svg width="14" height="14" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="7 7 17 7 17 17" />
    </svg>
);

function ServiceCards({ setPage }) {
    // Each card: CSS class for colour, badge text, title, description
    // wide: true means it spans 2 columns (featured card)
    const cards = [
        { cls: "svc-water", badge: "842 complaints", title: "Water Supply", desc: "Leakage, no supply, contamination, low pressure", wide: true },
        { cls: "svc-elec", badge: "480 complaints", title: "Electricity", desc: "Power cuts, meter issues, streetlight faults" },
        { cls: "svc-road", badge: "601 complaints", title: "Roads & Potholes", desc: "Potholes, broken roads, footpath damage" },
        { cls: "svc-san", badge: "534 complaints", title: "Sanitation", desc: "Garbage, blocked drains, cleanliness" },
        { cls: "svc-light", badge: "312 complaints", title: "Street Lights", desc: "Non-functional lights, wiring hazards" },
        { cls: "svc-other", badge: "435 complaints", title: "Other Services", desc: "Parks, stray animals, encroachments, noise" },
    ];

    return (
        <div className="sec-wrap" style={{ background: "#fff" }}>
            <div className="sec-inner">

                {/* Section header with title and button */}
                <div className="sec-header">
                    <div>
                        <div className="sec-eyebrow">Services</div>
                        <h2 className="sec-title">What can you <em>report?</em></h2>
                        <p className="sec-sub" style={{ margin: 0 }}>
                            Six categories of civic complaints handled by dedicated departments with SLA tracking.
                        </p>
                    </div>
                    <button
                        style={{ padding: "10px 20px", background: "linear-gradient(135deg,var(--i2),var(--t2))", color: "#fff", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                        onClick={() => setPage("register")}
                    >
                        File a Complaint →
                    </button>
                </div>

                {/* Card grid */}
                <div className="svc-grid-new">
                    {cards.map(({ cls, badge, title, desc, wide }) => (
                        <div
                            key={title}
                            className={`svc-card-new ${cls}`}
                            style={wide ? { gridColumn: "span 2" } : {}}
                        >
                            <div className="svc-gradient" />
                            <div className="svc-arrow"><ArrowIcon /></div>
                            <div className="svc-content">
                                <div className="svc-badge">{badge}</div>
                                <div className="svc-title">{title}</div>
                                <div className="svc-desc">{desc}</div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default ServiceCards;