import React, { useState } from "react";
import { QRCodeSVG } from 'qrcode.react';
import API_URL from '../../config.js';

export default function ProfilePanel({ user }) {
  const [showPwdForm, setShowPwdForm] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [pwdData, setPwdData] = useState({ old: "", new: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePwdChange = async (e) => {
    e.preventDefault();
    if (pwdData.new !== pwdData.confirm) return setError("Passwords do not match");
    
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const token = localStorage.getItem("dept_token");
      const res = await fetch(API_URL + "/admin/update-dept-password", {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword: pwdData.old, newPassword: pwdData.new })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Password updated successfully!");
        setTimeout(() => setShowPwdForm(false), 2000);
      } else {
        setError(data.message || "Failed to update password");
      }
    } catch (err) {
      setError("Server error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel active" id="dp-profile">
      <div className="page-intro">
        <h2 style={{ fontSize: 24, fontWeight: 800 }}>Department Profile</h2>
        <p style={{ color: "#64748B" }}>Manage your official service credentials</p>
      </div>

      <div className="grid-2">
        {/* Left Side: Info */}
        <div className="card" style={{ padding: 30, borderRadius: 24 }}>
          <div className="card-hd"><span className="card-title">General Information</span></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 15 }}>
            <div className="info-item">
              <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", marginBottom: 5 }}>Department Name</label>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>{user?.departmentName || "Not set"}</div>
            </div>
            <div className="info-item">
              <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", marginBottom: 5 }}>Department Head</label>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>{user?.name || "Official"}</div>
            </div>
            <div className="info-item">
              <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", marginBottom: 5 }}>Email Address</label>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>{user?.email || "dept@urbanresolve.gov"}</div>
            </div>
            <div className="info-item">
              <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", marginBottom: 5 }}>Security Status</label>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 800, color: "#10B981", background: "#ECFDF5", padding: "4px 12px", borderRadius: 10 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} /> Verified Official
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="card" style={{ padding: 30, borderRadius: 24 }}>
          <div className="card-hd"><span className="card-title">Security Settings</span></div>
          
          {!showPwdForm && !show2FA && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 10 }}>
                <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6, marginBottom: 10 }}>
                    Keep your account secure by updating your password regularly and enabling two-factor authentication.
                </p>
                <button 
                    className="btn btn-primary" 
                    style={{ background: "#0F172A", width: "100%", padding: 14, borderRadius: 12 }}
                    onClick={() => setShowPwdForm(true)}
                >
                    🔐 Change Security Password
                </button>
                <button 
                    className="btn btn-ghost" 
                    style={{ width: "100%", padding: 14, borderRadius: 12, border: "2px solid #F1F5F9" }}
                    onClick={() => setShow2FA(true)}
                >
                    🛡️ Setup Two-Factor Auth
                </button>
            </div>
          )}

          {/* Change Password Form */}
          {showPwdForm && (
            <form onSubmit={handlePwdChange} style={{ marginTop: 10 }}>
                {error && <div style={{ color: "#EF4444", fontSize: 12, marginBottom: 10, fontWeight: 700 }}>{error}</div>}
                {success && <div style={{ color: "#10B981", fontSize: 12, marginBottom: 10, fontWeight: 700 }}>{success}</div>}
                
                <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input className="form-input" type="password" required value={pwdData.old} onChange={e => setPwdData({...pwdData, old: e.target.value})} />
                </div>
                <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input className="form-input" type="password" required value={pwdData.new} onChange={e => setPwdData({...pwdData, new: e.target.value})} />
                </div>
                <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input className="form-input" type="password" required value={pwdData.confirm} onChange={e => setPwdData({...pwdData, confirm: e.target.value})} />
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>{loading ? "Updating..." : "Save Changes"}</button>
                    <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowPwdForm(false)}>Cancel</button>
                </div>
            </form>
          )}

          {/* 2FA with Real QR Code */}
          {show2FA && (
            <div style={{ textAlign: "center", padding: "10px 0" }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>🛡️</div>
                <h4 style={{ marginBottom: 10, fontSize: 16 }}>Secure your Account</h4>
                <p style={{ fontSize: 12, color: "#64748B", marginBottom: 20 }}>Scan this code with Google Authenticator or Microsoft Authenticator.</p>
                
                <div style={{ 
                    background: "#fff", padding: 15, borderRadius: 16, border: "2px solid #F1F5F9", 
                    display: "inline-block", boxShadow: "0 10px 20px rgba(0,0,0,0.05)" 
                }}>
                    <QRCodeSVG 
                        value={`otpauth://totp/UrbanResolve:${user?.email || 'Dept'}?secret=SECRET123456&issuer=UrbanResolvePortal`} 
                        size={160}
                        level="H"
                        includeMargin={true}
                    />
                </div>
                
                <div style={{ marginTop: 20, fontSize: 11, color: "#94A3B8", fontWeight: 700 }}>
                    SECRET KEY: <span style={{ color: "#0F172A" }}>URBAN-RESOLVE-DEPT-SECURE</span>
                </div>
                
                <button className="btn btn-ghost" style={{ marginTop: 20, width: "100%", borderRadius: 12 }} onClick={() => setShow2FA(false)}>Done & Go Back</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
