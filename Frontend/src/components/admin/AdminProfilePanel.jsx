import React, { useState } from "react";

export default function AdminProfilePanel({ user }) {
    const [showPwdForm, setShowPwdForm] = useState(false);
    const [pwdData, setPwdData] = useState({ old: "", new: "", confirm: "" });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: "", text: "" });

    const handlePwdChange = async (e) => {
        e.preventDefault();
        if (pwdData.new !== pwdData.confirm) return setMsg({ type: "error", text: "Passwords do not match" });
        
        try {
            setLoading(true);
            const token = localStorage.getItem("admin_token");
            const res = await fetch("http://localhost:5000/api/v1/admin/update-password", {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ currentPassword: pwdData.old, newPassword: pwdData.new })
            });

            const data = await res.json();
            if (res.ok) {
                setMsg({ type: "success", text: "Password updated successfully!" });
                setPwdData({ old: "", new: "", confirm: "" });
                setTimeout(() => setShowPwdForm(false), 2000);
            } else {
                setMsg({ type: "error", text: data.message || "Failed to update" });
            }
        } catch (err) {
            setMsg({ type: "error", text: "Server error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="panel active">
            <div className="page-intro">
                <h2>Admin Profile Settings</h2>
                <p>Manage your master security credentials</p>
            </div>

            <div className="grid-2">
                <div className="card" style={{ padding: 30, borderRadius: 24 }}>
                    <div className="card-hd"><span className="card-title">Account Information</span></div>
                    <div style={{ display: "flex", alignItems: "center", gap: 15, marginBottom: 25, marginTop: 10 }}>
                        <div style={{ width: 60, height: 60, borderRadius: 20, background: "#0F172A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800 }}>
                            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>{user?.name || "Super Admin"}</div>
                            <div style={{ fontSize: 13, color: "#64748B" }}>Level: Global Administrator</div>
                        </div>
                    </div>

                    <div className="info-item" style={{ marginBottom: 20 }}>
                        <label style={{ fontSize: 11, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase" }}>Master Email</label>
                        <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>{user?.email || "admin@urbanresolve.gov.in"}</div>
                    </div>

                    <div style={{ padding: "12px 16px", background: "#F0F9FF", border: "1px solid #B9E6FE", borderRadius: 12, display: "flex", gap: 12, alignItems: "center" }}>
                        <div style={{ fontSize: 20 }}>🛡️</div>
                        <div style={{ fontSize: 12, color: "#0369A1", lineHeight: 1.5 }}>
                            Your account has full system access. Ensure you use a strong, unique password.
                        </div>
                    </div>
                </div>

                <div className="card" style={{ padding: 30, borderRadius: 24 }}>
                    <div className="card-hd"><span className="card-title">Security Actions</span></div>
                    
                    {!showPwdForm ? (
                        <div style={{ marginTop: 10 }}>
                            <p style={{ fontSize: 13, color: "#64748B", marginBottom: 20 }}>Regularly updating your security key is recommended for global admins.</p>
                            <button className="btn btn-primary" style={{ width: "100%", background: "#0F172A" }} onClick={() => setShowPwdForm(true)}>
                                🔐 Change Master Security Key
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handlePwdChange}>
                            {msg.text && (
                                <div style={{ 
                                    padding: 10, borderRadius: 8, fontSize: 12, marginBottom: 15, fontWeight: 700,
                                    background: msg.type === "success" ? "#ECFDF5" : "#FEF2F2",
                                    color: msg.type === "success" ? "#059669" : "#DC2626"
                                }}>
                                    {msg.text}
                                </div>
                            )}
                            <div className="form-group">
                                <label className="form-label">Current Key</label>
                                <input className="form-input" type="password" required value={pwdData.old} onChange={e => setPwdData({...pwdData, old: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">New Security Key</label>
                                <input className="form-input" type="password" required value={pwdData.new} onChange={e => setPwdData({...pwdData, new: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Confirm New Key</label>
                                <input className="form-input" type="password" required value={pwdData.confirm} onChange={e => setPwdData({...pwdData, confirm: e.target.value})} />
                            </div>
                            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>{loading ? "Saving..." : "Update Key"}</button>
                                <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowPwdForm(false)}>Cancel</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
