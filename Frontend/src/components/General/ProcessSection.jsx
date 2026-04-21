// ─────────────────────────────────────────────
// COMPONENT: ProcessSection
// Dark background section showing the 4-step process.
// No props needed.
// ─────────────────────────────────────────────

function ProcessSection() {
    const steps = [
        { icon: "👤", title: "Register", desc: "Create a free citizen account with Aadhaar and mobile verification in 60 seconds." },
        { icon: "📝", title: "File Complaint", desc: "Select category, pin location on map, add photos and description — submit in minutes." },
        { icon: "📡", title: "Track Progress", desc: "Real-time SMS and portal updates at every stage from filing to resolution." },
        { icon: "⭐", title: "Give Feedback", desc: "Rate resolution quality and help improve services for your entire community." },
    ];

    return (
        <div className="process-bg">
            <div className="process-inner">
                <div className="process-title">Simple 4-step process</div>
                <div className="process-sub">From registration to resolution — we make it effortless.</div>

                <div className="process-steps">
                    {/* Horizontal connector line behind the circles */}
                    <div className="process-connector" />

                    {steps.map(({ icon, title, desc }) => (
                        <div key={title} className="process-step">
                            <div className="ps-circle">
                                <div className="ps-circle-bg" />
                                <div className="ps-circle-border" />
                                <span className="ps-icon">{icon}</span>
                            </div>
                            <div className="ps-title">{title}</div>
                            <div className="ps-desc">{desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProcessSection;