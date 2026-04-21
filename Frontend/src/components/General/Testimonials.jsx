// ─────────────────────────────────────────────
// COMPONENT: Testimonials
// Shows 3 citizen review cards.
// No props needed.
// ─────────────────────────────────────────────

function Testimonials() {
    const reviews = [
        {
            stars: "★★★★★",
            quote: "My water complaint was resolved in under 2 days. The real-time tracking made all the difference — I knew exactly what was happening.",
            initials: "RK", name: "Rahul Kumar", role: "Resident, Ward 7",
            bg: "linear-gradient(135deg,#6D28D9,#0891B2)"
        },
        {
            stars: "★★★★★",
            quote: "Filing a complaint used to take hours at the municipal office. Now I do it in 3 minutes from my phone. This is exactly what our city needed.",
            initials: "PK", name: "Priya Kapoor", role: "Teacher, Ward 3",
            bg: "linear-gradient(135deg,#0E6B8A,#059669)"
        },
        {
            stars: "★★★★☆",
            quote: "The photo upload feature and department messaging make this the most transparent complaint system I've ever used. Great initiative!",
            initials: "AM", name: "Amit Malhotra", role: "Business Owner, Ward 12",
            bg: "linear-gradient(135deg,#D97706,#DC2626)"
        },
    ];

    return (
        <div className="testi-strip">
            <div className="testi-inner">

                {/* Header */}
                <div style={{ textAlign: "center" }}>
                    <div className="sec-eyebrow" style={{ margin: "0 auto 14px" }}>⭐ Citizen Reviews</div>
                    <h2 className="sec-title" style={{ textAlign: "center" }}>Loved by <em>citizens</em></h2>
                    <p style={{ fontSize: 14, color: "var(--g400)", textAlign: "center" }}>
                        What Smart City residents say about the portal
                    </p>
                </div>

                {/* Review cards */}
                <div className="testi-grid">
                    {reviews.map(({ stars, quote, initials, name, role, bg }) => (
                        <div key={name} className="testi-card">
                            <div className="tc-stars">{stars}</div>
                            <div className="tc-quote">"{quote}"</div>
                            <div className="tc-user">
                                <div className="tc-av" style={{ background: bg }}>{initials}</div>
                                <div>
                                    <div className="tc-name">{name}</div>
                                    <div className="tc-role">{role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default Testimonials;