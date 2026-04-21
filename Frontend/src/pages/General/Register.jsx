import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Form States
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [aadhaar, setAadhaar] = useState("");
    const [ward, setWard] = useState("");
    const [block, setBlock] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("http://localhost:5000/api/v1/citizen/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName, lastName, email, mobileNumber: mobile,
                    aadhaarNumber: aadhaar, ward, block, password,
                    address: `${block}, ${ward}`
                })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("citizen_token", data.token);
                localStorage.setItem("citizen_data", JSON.stringify(data));
                navigate("/citizen");
            } else {
                setError(data.message || "Registration failed");
            }
        } catch (err) {
            setError("Server connection failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrap" style={{ padding: "32px 16px" }}>
            <div className="auth-card" style={{ maxWidth: 500 }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,var(--i2),var(--t2),var(--i3))", borderRadius: "var(--rxl) var(--rxl) 0 0" }} />
                <div className="auth-glow" />

                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                    <div className="auth-logo-mark">
                        <svg width="19" height="19" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 800, color: "var(--g900)" }}>Urban Resolve Portal</div>
                        <div style={{ fontSize: 11, color: "var(--g400)" }}>Citizen Registration</div>
                    </div>
                </div>

                <div className="auth-h">Create Your Account</div>
                <div className="auth-sub">Free forever — start filing complaints today</div>

                <form onSubmit={handleRegister}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label req">First Name</label>
                            <input className="form-input" placeholder="Rahul" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label req">Last Name</label>
                            <input className="form-input" placeholder="Kumar" value={lastName} onChange={e => setLastName(e.target.value)} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label req">Mobile Number</label>
                        <input className="form-input" placeholder="+91 98765 43210" value={mobile} onChange={e => setMobile(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label className="form-label req">Email Address</label>
                        <input type="email" className="form-input" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label className="form-label req">Aadhaar Number</label>
                        <input className="form-input" placeholder="XXXX-XXXX-XXXX" value={aadhaar} onChange={e => setAadhaar(e.target.value)} required />
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label req">Ward</label>
                            <select className="form-input" style={{ cursor: "pointer" }} value={ward} onChange={e => setWard(e.target.value)} required>
                                <option value="">Select Ward</option>
                                <option value="Ward 1">Ward 1</option>
                                <option value="Ward 7">Ward 7</option>
                                <option value="Ward 12">Ward 12</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label req">Block</label>
                            <input className="form-input" placeholder="Block B" value={block} onChange={e => setBlock(e.target.value)} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label req">Password</label>
                        <input type="password" className="form-input" placeholder="Min 8 characters" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>

                    {error && <div style={{ color: "var(--r1)", fontSize: 12, marginBottom: 10, textAlign: "center", fontWeight: 600 }}>{error}</div>}

                    <button type="submit" className="sbtn" disabled={loading}>
                        {loading ? "Creating..." : "Create Citizen Account →"}
                    </button>
                </form>

                <div className="auth-foot">
                    Already registered? <Link to="/general/login">Sign in →</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;