import React, { useState, useEffect } from "react";

const ProfilePanel = ({ activePanel, user: initialUser, setUser: setGlobalUser }) => {
  const [localUser, setLocalUser] = useState(initialUser);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    ward: "",
    block: "",
    notificationPrefs: { sms: true, email: true, urgent: true }
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Password Change State
  const [showPwdForm, setShowPwdForm] = useState(false);
  const [pwdData, setPwdData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMessage, setPwdMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (initialUser) {
      setLocalUser(initialUser);
      setFormData({
        firstName: initialUser.firstName || "",
        lastName: initialUser.lastName || "",
        email: initialUser.email || "",
        mobileNumber: initialUser.mobileNumber || "",
        ward: initialUser.ward || "",
        block: initialUser.block || "",
        notificationPrefs: initialUser.notificationPrefs || { sms: true, email: true, urgent: true }
      });
    }
  }, [initialUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggle = (key) => {
    setFormData({
        ...formData,
        notificationPrefs: {
            ...formData.notificationPrefs,
            [key]: !formData.notificationPrefs[key]
        }
    });
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("citizen_token");
      const res = await fetch("http://localhost:5000/api/v1/citizen/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Profile & Preferences updated successfully!" });
        setLocalUser(data);
        if (setGlobalUser) setGlobalUser(data);
        localStorage.setItem("citizen_data", JSON.stringify(data));
      } else {
        setMessage({ type: "error", text: data.message || "Failed to update profile" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Server connection failed" });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (pwdData.newPassword !== pwdData.confirmPassword) {
        return setPwdMessage({ type: "error", text: "New passwords do not match" });
    }
    setPwdLoading(true);
    setPwdMessage({ type: "", text: "" });
    try {
        const token = localStorage.getItem("citizen_token");
        const res = await fetch("http://localhost:5000/api/v1/citizen/update-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                currentPassword: pwdData.currentPassword,
                newPassword: pwdData.newPassword
            })
        });
        const data = await res.json();
        if (res.ok) {
            setPwdMessage({ type: "success", text: "Password changed successfully!" });
            setPwdData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setTimeout(() => setShowPwdForm(false), 2000);
        } else {
            setPwdMessage({ type: "error", text: data.message || "Failed to change password" });
        }
    } catch (err) {
        setPwdMessage({ type: "error", text: "Server connection failed" });
    } finally {
        setPwdLoading(false);
    }
  };

  if (!localUser) return null;

  return (
    <>
      <div className={`panel ${activePanel === "cp-profile" ? "active" : ""}`} id="cp-profile">
        <div className="page-intro">
          <h2 style={{ fontSize: 24, fontWeight: 800 }}>My Profile</h2>
          <p style={{ color: "#64748B" }}>Manage your account and preferences</p>
        </div>

        <div className="grid-2">
          <div className="card" style={{ borderRadius: 20, padding: 28 }}>
            <div className="card-hd">
              <span className="card-title">Personal Information</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid var(--gray-100)" }}>
              <div className="user-av green" style={{ width: 52, height: 52, fontSize: 17, borderRadius: 13, textTransform: "uppercase" }}>
                {localUser?.firstName?.[0] || ""}{localUser?.lastName?.[0] || ""}
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--gray-900)" }}>
                  {localUser?.firstName} {localUser?.lastName}
                </div>
                <div style={{ fontSize: 12, color: "var(--gray-400)" }}>
                  CIT-{localUser?._id?.slice(-5).toUpperCase() || "00000"} · ✓ Verified Citizen
                </div>
              </div>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input className="form-input" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input className="form-input" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile</label>
                  <input className="form-input" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Ward</label>
                  <select className="form-input" name="ward" value={formData.ward} onChange={handleChange} required>
                    <option value="Ward 1">Ward 1</option>
                    <option value="Ward 7">Ward 7</option>
                    <option value="Ward 12">Ward 12</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Block</label>
                  <input className="form-input" name="block" value={formData.block} onChange={handleChange} required />
                </div>
              </div>

              {message.text && (
                <div style={{ 
                  padding: "10px", borderRadius: "8px", fontSize: "13px", marginBottom: "15px",
                  background: message.type === "success" ? "#ECFDF5" : "#FEF2F2",
                  color: message.type === "success" ? "#059669" : "#DC2626",
                  border: message.type === "success" ? "1px solid #D1FAE5" : "1px solid #FEE2E2"
                }}>
                  {message.text}
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: 12, borderRadius: 10 }} disabled={loading}>
                {loading ? "Saving..." : "Save All Changes"}
              </button>
            </form>
          </div>

          <div>
            <div className="card" style={{ marginBottom: 20, borderRadius: 20, padding: 28 }}>
              <div className="card-hd">
                <span className="card-title">Account Security</span>
              </div>
              
              {!showPwdForm ? (
                <>
                    <p style={{ fontSize: "13px", color: "var(--gray-500)", marginBottom: 15 }}>Update your account password to maintain security.</p>
                    <button 
                        className="btn btn-ghost" 
                        style={{ width: "100%", border: "2px solid #F1F5F9" }}
                        onClick={() => setShowPwdForm(true)}
                    >
                        🔐 Change Password
                    </button>
                </>
              ) : (
                <form onSubmit={handlePasswordUpdate}>
                    <div className="form-group">
                        <label className="form-label">Current Password</label>
                        <input className="form-input" type="password" required value={pwdData.currentPassword} onChange={e => setPwdData({...pwdData, currentPassword: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">New Password</label>
                        <input className="form-input" type="password" required value={pwdData.newPassword} onChange={e => setPwdData({...pwdData, newPassword: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Confirm New Password</label>
                        <input className="form-input" type="password" required value={pwdData.confirmPassword} onChange={e => setPwdData({...pwdData, confirmPassword: e.target.value})} />
                    </div>

                    {pwdMessage.text && (
                        <div style={{ fontSize: 12, color: pwdMessage.type === "success" ? "#10B981" : "#EF4444", marginBottom: 10, fontWeight: 700 }}>
                            {pwdMessage.text}
                        </div>
                    )}

                    <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={pwdLoading}>
                            {pwdLoading ? "Saving..." : "Update"}
                        </button>
                        <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowPwdForm(false)}>Cancel</button>
                    </div>
                </form>
              )}
            </div>

            <div className="card" style={{ borderRadius: 20, padding: 28 }}>
              <div className="card-hd">
                <span className="card-title">Notification Preferences</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 14, color: "var(--gray-700)", fontWeight: 500 }}>SMS Updates</span>
                    <label className="switch" style={{ position: "relative", display: "inline-block", width: 40, height: 20 }}>
                        <input 
                            type="checkbox" 
                            checked={formData.notificationPrefs.sms} 
                            onChange={() => handleToggle("sms")}
                            style={{ opacity: 0, width: 0, height: 0 }} 
                        />
                        <span style={{ 
                            position: "absolute", cursor: "pointer", inset: 0, 
                            background: formData.notificationPrefs.sms ? "var(--green)" : "#CBD5E1", 
                            borderRadius: 34, transition: ".4s" 
                        }} />
                    </label>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 14, color: "var(--gray-700)", fontWeight: 500 }}>Email Alerts</span>
                    <label className="switch" style={{ position: "relative", display: "inline-block", width: 40, height: 20 }}>
                        <input 
                            type="checkbox" 
                            checked={formData.notificationPrefs.email} 
                            onChange={() => handleToggle("email")}
                            style={{ opacity: 0, width: 0, height: 0 }} 
                        />
                        <span style={{ 
                            position: "absolute", cursor: "pointer", inset: 0, 
                            background: formData.notificationPrefs.email ? "var(--green)" : "#CBD5E1", 
                            borderRadius: 34, transition: ".4s" 
                        }} />
                    </label>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 14, color: "var(--gray-700)", fontWeight: 500 }}>Urgent Announcements</span>
                    <label className="switch" style={{ position: "relative", display: "inline-block", width: 40, height: 20 }}>
                        <input 
                            type="checkbox" 
                            checked={formData.notificationPrefs.urgent} 
                            onChange={() => handleToggle("urgent")}
                            style={{ opacity: 0, width: 0, height: 0 }} 
                        />
                        <span style={{ 
                            position: "absolute", cursor: "pointer", inset: 0, 
                            background: formData.notificationPrefs.urgent ? "var(--green)" : "#CBD5E1", 
                            borderRadius: 34, transition: ".4s" 
                        }} />
                    </label>
                </div>
              </div>
              <button 
                className="btn btn-ghost" 
                style={{ marginTop: 20, width: "100%", border: "2px solid #F1F5F9" }}
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Update Preferences"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .switch input:checked + span { background-color: var(--green); }
        .switch span:before {
          position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px;
          background-color: white; transition: .4s; border-radius: 50%;
        }
        .switch input:checked + span:before { transform: translateX(20px); }
      `}</style>
    </>
  );
};

export default ProfilePanel;