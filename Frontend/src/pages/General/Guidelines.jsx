// ─────────────────────────────────────────────
// PAGE: Guidelines
// Shows step-by-step guide for filing complaints + FAQ section.
// FaqItem is a small helper component defined in this same file
// because it's only used here.
// ─────────────────────────────────────────────

import { useState } from "react";

// ── Small helper: a single collapsible FAQ item ──
// Uses useState to toggle open/closed when clicked
function FaqItem({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="faq-item">
            <div className="faq-q" onClick={() => setIsOpen(!isOpen)}>
                {question}
                <span className="faq-chev">{isOpen ? "▲" : "▼"}</span>
            </div>
            {/* Only show answer when isOpen is true */}
            {isOpen && <div className="faq-a">{answer}</div>}
        </div>
    );
}

// ── Main Page ──
function Guidelines() {
    const steps = [
        { title: "Register a citizen account", desc: "Sign up with your name, mobile, Aadhaar, and ward details. Aadhaar verification required for genuine complaints." },
        { title: "Select the correct complaint category", desc: "Choose from Water, Electricity, Roads, Sanitation, Street Lights, or Other. Wrong categories delay routing." },
        { title: "Provide accurate location details", desc: "Use GPS pin or enter ward, block, and street address. Include a nearby landmark for faster response." },
        { title: "Upload supporting photos (up to 5)", desc: "Clear photos significantly speed up verification. Show the issue clearly from multiple angles." },
        { title: "Write a clear, detailed description", desc: "State when the issue started, how many people are affected, and any previous attempts to report it." },
        { title: "Track and provide feedback", desc: "Monitor real-time progress and rate the resolution quality once completed." },
    ];

    const faqs = [
        { q: "How long does resolution take?", a: "Average resolution is 4.2 days. SLA: Electricity 1 day, Water 3 days, Roads 7 days." },
        { q: "Can I track my complaint status?", a: "Yes. Log in and visit 'Track Complaints' to see a live 5-step timeline from filing to resolution." },
        { q: "What if my complaint is rejected?", a: "Rejection reasons are always provided. You may re-file with corrected details or appeal via the Contact page." },
    ];

    const doNots = [
        "File duplicate complaints for the same issue",
        "Submit false or fabricated reports",
        "Use offensive language in descriptions",
        "Report non-civic personal disputes",
    ];

    return (
        <div>
            {/* Page banner */}
            <div className="inner-hero">
                <div className="ih-tag">Guidelines</div>
                <div className="ih-title">How to File a Complaint</div>
                <p className="ih-sub">Follow these steps for the fastest resolution of your civic issue.</p>
            </div>

            <div className="sec-wrap">
                <div className="sec-inner" style={{ maxWidth: 800 }}>

                    {/* Step-by-step guide */}
                    <div className="guide-list">
                        {steps.map(({ title, desc }, index) => (
                            <div key={index} className="guide-item">
                                <div className="guide-num">{index + 1}</div>
                                <div>
                                    <div className="guide-title">{title}</div>
                                    <div className="guide-desc">{desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Do NOT section */}
                    <div style={{ background: "linear-gradient(135deg,var(--red-bg),#FFF1F2)", border: "1px solid var(--red-border)", borderRadius: "var(--rl)", padding: 22, marginTop: 28 }}>
                        <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 800, color: "var(--red)", marginBottom: 14 }}>
                            ⚠ Do NOT
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                            {doNots.map(text => (
                                <div key={text} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--g600)", background: "#fff", borderRadius: 9, padding: 11 }}>
                                    <span style={{ color: "var(--red)", fontWeight: 700 }}>✗</span> {text}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FAQ section */}
                    <div style={{ marginTop: 36 }}>
                        <div className="sec-eyebrow" style={{ display: "block", marginBottom: 16 }}>FAQ</div>
                        <div className="faq-list">
                            {faqs.map(({ q, a }) => (
                                <FaqItem key={q} question={q} answer={a} />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Guidelines;