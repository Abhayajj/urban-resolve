import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from '../../config.js';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showGoogleMock, setShowGoogleMock] = useState(false);

    const handleGoogleLogin = () => {
        setLoading(true);
        setShowGoogleMock(true);
        
        // Simulate Google Authentication sequence
        setTimeout(async () => {
            try {
                const res = await fetch(API_URL + "/citizen/google-mock-login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        email: "abhay@gmail.com",
                        firstName: "Abhay",
                        lastName: "Gupta"
                    })
                });
                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem("citizen_token", data.token);
                    localStorage.setItem("citizen_data", JSON.stringify(data));
                    navigate("/citizen");
                } else {
                    setError(data.message || "Simulated login failed");
                }
            } catch (err) {
                setError("Connection error during simulation");
            } finally {
                setLoading(false);
            }
        }, 2000);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch(API_URL + "/citizen/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("citizen_token", data.token);
                localStorage.setItem("citizen_data", JSON.stringify(data));
                navigate("/citizen");
            } else {
                setError(data.message || "Invalid credentials");
            }
        } catch (err) {
            setError("Server connection failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrap">
            <div className="auth-card">
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,var(--i2),var(--t2),var(--i3))", borderRadius: "var(--rxl) var(--rxl) 0 0" }} />
                <div className="auth-glow" />

                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                    <div className="auth-logo-mark">
                        <svg width="19" height="19" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M3 9l9-7 9 7v11H3z" />
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 800, color: "var(--g900)" }}>Urban Resolve Portal</div>
                        <div style={{ fontSize: 11, color: "var(--g400)" }}>Citizen Login</div>
                    </div>
                </div>

                <div className="auth-h">Welcome Back</div>
                <div className="auth-sub">Sign in to your citizen account</div>

                <div style={{ marginBottom: 18 }}>
                    <button 
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, padding: "12px", border: "1.5px solid var(--g200)", borderRadius: 12, background: "#fff", fontSize: 13, fontWeight: 700, color: "var(--g700)", cursor: "pointer", width: "100%", transition: "0.2s" }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        {loading && showGoogleMock ? "Authenticating..." : "Continue with Google"}
                    </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                    <div style={{ flex: 1, height: 1, background: "var(--g100)" }} />
                    <span style={{ fontSize: 12, color: "var(--g300)" }}>or sign in with email</span>
                    <div style={{ flex: 1, height: 1, background: "var(--g100)" }} />
                </div>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label">Mobile / Email</label>
                        <input className="form-input" placeholder="rahul@test.com" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label" style={{ display: "flex", justifyContent: "space-between" }}>
                            Password
                            <span style={{ color: "var(--i2)", fontWeight: 700, cursor: "pointer", fontSize: 11 }}>Forgot?</span>
                        </label>
                        <input type="password" className="form-input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>

                    {error && <div style={{ color: "var(--r1)", fontSize: 12, marginBottom: 10, textAlign: "center", fontWeight: 600 }}>{error}</div>}

                    <button type="submit" className="sbtn" disabled={loading}>
                        {loading && !showGoogleMock ? "Signing In..." : "Sign In to Portal"}
                    </button>
                </form>

                <div className="auth-foot">
                    No account? <Link to="/general/register">Register for free →</Link>
                </div>
            </div>

            {/* Simulated Google Popup */}
            {showGoogleMock && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
                    <div style={{ background: "#fff", padding: 40, borderRadius: 16, width: 380, textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" style={{ marginBottom: 20 }}>
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Sign in with Google</h3>
                        <p style={{ fontSize: 13, color: "#64748B", marginBottom: 30 }}>to continue to Urban Resolve</p>
                        
                        <div style={{ padding: "10px", border: "1px solid #E2E8F0", borderRadius: 12, display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
                            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#4285F4", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>A</div>
                            <div>
                                <div style={{ fontSize: 12, fontWeight: 700 }}>Abhay Gupta</div>
                                <div style={{ fontSize: 11, color: "#64748B" }}>abhay@gmail.com</div>
                            </div>
                        </div>

                        <div style={{ marginTop: 30 }}>
                            <div className="google-loader" style={{ width: 24, height: 24, border: "3px solid #f3f3f3", borderTop: "3px solid #4285F4", borderRadius: "50%", margin: "0 auto", animation: "spin 1s linear infinite" }}></div>
                            <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 10 }}>Verifying account...</p>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

export default Login;