import React, { useState } from "react";
import API_URL from '../../config.js';

function Contact() {
    const contactCards = [
        { bg: "rgba(14,107,138,.1)", label: "Email Support", value: "support@urbanresolve.gov.in", sub: "Reply within 24 hours" },
        { bg: "rgba(14,164,114,.1)", label: "Toll Free Helpdesk", value: "1800-XXX-XXXX", sub: "Mon–Sat, 9am–6pm" },
        { bg: "rgba(249,115,22,.1)", label: "Emergency Issues", value: "Water & Electricity", sub: "24/7 priority line" },
    ];

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("General Enquiry");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState("");
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatusMsg("");
        setIsError(false);

        try {
            const res = await fetch(API_URL + "/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, subject, message })
            });

            const data = await res.json();

            if (!res.ok) {
                setStatusMsg(data.message || "Failed to send message.");
                setIsError(true);
            } else {
                setStatusMsg("Message sent successfully! We will get back to you soon.");
                setName("");
                setEmail("");
                setSubject("General Enquiry");
                setMessage("");
            }
        } catch (error) {
            setStatusMsg("Server error. Please try again later.");
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Page banner */}
            <div className="inner-hero">
                <div className="ih-tag">Contact</div>
                <div className="ih-title">Contact &amp; Support</div>
                <p className="ih-sub">We're here to help. Reach out through any channel below.</p>
            </div>

            <div className="sec-wrap">
                <div className="contact-grid">

                    {/* Left: Contact info cards */}
                    <div className="contact-infos">
                        {contactCards.map(({ bg, label, value, sub }) => (
                            <div key={label} className="contact-card">
                                <div className="cc-icon" style={{ background: bg }} />
                                <div className="cc-label">{label}</div>
                                <div className="cc-value">{value}</div>
                                <div className="cc-sub">{sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* Right: Message form */}
                    <div style={{ background: "#fff", border: "1px solid var(--g200)", borderRadius: "var(--rxl)", padding: 28, boxShadow: "var(--sh-sm)" }}>
                        <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 16, fontWeight: 800, color: "var(--g900)", marginBottom: 20 }}>
                            Send a Message
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Name</label>
                                    <input 
                                        className="form-input" 
                                        placeholder="Full name" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone / Email</label>
                                    <input 
                                        type="email"
                                        className="form-input" 
                                        placeholder="Email address" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Subject</label>
                                <select 
                                    className="form-input" 
                                    style={{ cursor: "pointer" }}
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                >
                                    <option>General Enquiry</option>
                                    <option>Technical Support</option>
                                    <option>Complaint Follow-up</option>
                                    <option>Bug Report</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Message</label>
                                <textarea 
                                    className="form-input" 
                                    rows={4} 
                                    placeholder="Describe your issue or question…" 
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                />
                            </div>

                            {statusMsg && (
                                <div style={{ 
                                    padding: "10px 14px", 
                                    marginBottom: 15, 
                                    borderRadius: 8, 
                                    fontSize: 14,
                                    background: isError ? "#FEE2E2" : "#D1FAE5",
                                    color: isError ? "#B91C1C" : "#065F46"
                                }}>
                                    {statusMsg}
                                </div>
                            )}

                            <button type="submit" className="sbtn" disabled={loading}>
                                {loading ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Contact;