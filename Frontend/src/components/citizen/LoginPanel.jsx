import React, { useState } from "react";
import API_URL from '../../config.js';

export default function LoginPanel({ activePanel, setActivePanel, setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [ward, setWard] = useState("");
  const [block, setBlock] = useState("");

  // DigiLocker States
  const [showDigiLocker, setShowDigiLocker] = useState(false);
  const [digiLockerStep, setDigiLockerStep] = useState("aadhaar");
  const [digiLockerAadhaar, setDigiLockerAadhaar] = useState("");
  const [digiLockerOtp, setDigiLockerOtp] = useState("");
  const [digiLockerLoading, setDigiLockerLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const res = await fetch(API_URL + "/citizen/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("citizen_token", data.token);
        localStorage.setItem("citizen_data", JSON.stringify(data));
        setSuccess("Login successful!");
        
        // Update parent state immediately
        if (setUser) setUser(data);
        if (setActivePanel) setActivePanel("cp-dash");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Server connection failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const res = await fetch(API_URL + "/citizen/register", {
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
        setSuccess("Registration successful!");
        localStorage.setItem("citizen_token", data.token);
        localStorage.setItem("citizen_data", JSON.stringify(data));
        
        // Update parent state immediately
        if (setUser) setUser(data);
        if (setActivePanel) setActivePanel("cp-dash");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSendAadhaarOtp = () => {
    if (!digiLockerAadhaar.trim() || digiLockerAadhaar.replace(/-/g, "").length !== 12) {
      alert("Please enter a valid 12-digit Aadhaar number");
      return;
    }
    setDigiLockerLoading(true);
    setTimeout(() => {
      setDigiLockerLoading(false);
      setDigiLockerStep("otp");
    }, 1000);
  };

  const handleVerifyAadhaarOtp = async () => {
    if (!digiLockerOtp.trim() || digiLockerOtp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }
    setDigiLockerLoading(true);
    try {
      // Mock login as the seeded user rahul@test.com
      const res = await fetch(API_URL + "/citizen/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "rahul@test.com", password: "password123" })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("citizen_token", data.token);
        // Save flag indicating DigiLocker verification in both localStorage and React state
        const verifiedData = { ...data, isDigiLockerVerified: true };
        localStorage.setItem("citizen_data", JSON.stringify(verifiedData));
        setSuccess("DigiLocker e-Verification Successful!");
        setShowDigiLocker(false);
        if (setUser) setUser(verifiedData);
        if (setActivePanel) setActivePanel("cp-dash");
      } else {
        alert("DigiLocker synchronization failed: " + data.message);
      }
    } catch (err) {
      alert("DigiLocker gateway connection timeout");
    } finally {
      setDigiLockerLoading(false);
    }
  };

  return (
    <div className={`login-v2-container ${activePanel === "cp-login" ? "active" : ""}`}>
      <div className="login-v2-glass">
        <div className="login-v2-left">
          <div className="v2-branding">
            <div className="v2-logo">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 21h18M3 7v1a3 3 0 006 0V7m6 0v1a3 3 0 006 0V7m-9 0h.01M9 17h.01M9 13h.01M15 17h.01M15 13h.01M9 7l3-4 3 4M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" />
              </svg>
            </div>
            <span>Urban Resolve Citizen</span>
          </div>
          <h1>{isLogin ? "Welcome Back" : "Join Your City"}</h1>
          <p>{isLogin ? "Sign in to track your complaints and stay updated." : "Create an account to participate in city improvement."}</p>
          
          <div className="v2-toggle">
            <button className={isLogin ? "active" : ""} onClick={() => { setIsLogin(true); setError(""); setSuccess(""); }}>Login</button>
            <button className={!isLogin ? "active" : ""} onClick={() => { setIsLogin(false); setError(""); setSuccess(""); }}>Register</button>
          </div>
        </div>

        <div className="login-v2-right">
          {isLogin ? (
            <form onSubmit={handleLogin} className="v2-fade-in">
              <div className="v2-input-group">
                <label>Email / Mobile</label>
                <input type="text" placeholder="citizen@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="v2-input-group">
                <label>Password</label>
                <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              {error && <div className="v2-err-msg">{error}</div>}
              {success && <div className="v2-succ-msg">{success}</div>}
              <button type="submit" className="v2-main-btn" disabled={loading}>
                {loading ? "Verifying..." : "Sign In"}
              </button>
              <div style={{ margin: "16px 0 10px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF" }}>OR</span>
                <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
              </div>
              <button 
                type="button" 
                className="v2-main-btn" 
                onClick={() => { setShowDigiLocker(true); setDigiLockerStep("aadhaar"); }}
                style={{ 
                  background: "#1E3A8A", 
                  borderColor: "#3B82F6", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  gap: 8, 
                  marginTop: 0
                }}
              >
                🔐 Sign In with DigiLocker / Aadhaar
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="v2-fade-in scroll-form">
              <div className="v2-form-row">
                <div className="v2-input-group">
                  <label>First Name</label>
                  <input type="text" placeholder="Rahul" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                </div>
                <div className="v2-input-group">
                  <label>Last Name</label>
                  <input type="text" placeholder="Kumar" value={lastName} onChange={e => setLastName(e.target.value)} required />
                </div>
              </div>
              <div className="v2-input-group">
                <label>Email</label>
                <input type="email" placeholder="rahul@test.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="v2-form-row">
                <div className="v2-input-group">
                  <label>Mobile</label>
                  <input type="text" placeholder="9876..." value={mobile} onChange={e => setMobile(e.target.value)} required />
                </div>
                <div className="v2-input-group">
                  <label>Aadhaar</label>
                  <input type="text" placeholder="1234..." value={aadhaar} onChange={e => setAadhaar(e.target.value)} required />
                </div>
              </div>
              <div className="v2-form-row">
                <div className="v2-input-group">
                  <label>Ward</label>
                  <select value={ward} onChange={e => setWard(e.target.value)} required>
                    <option value="">Select</option>
                    <option value="Ward 1">Ward 1</option>
                    <option value="Ward 7">Ward 7</option>
                    <option value="Ward 12">Ward 12</option>
                  </select>
                </div>
                <div className="v2-input-group">
                  <label>Block</label>
                  <input type="text" placeholder="Block B" value={block} onChange={e => setBlock(e.target.value)} required />
                </div>
              </div>
              <div className="v2-input-group">
                <label>Password</label>
                <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              {error && <div className="v2-err-msg">{error}</div>}
              {success && <div className="v2-succ-msg">{success}</div>}
              <button type="submit" className="v2-main-btn" disabled={loading}>
                {loading ? "Creating..." : "Register Now"}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .login-v2-container {
          display: none; height: 100vh; width: 100vw;
          background: linear-gradient(135deg, #064E3B, #065F46);
          align-items: center; justify-content: center; font-family: 'Inter', sans-serif;
        }
        .login-v2-container.active { display: flex; }
        .login-v2-glass {
          width: 900px; height: 600px; display: flex;
          background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px);
          border-radius: 30px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden;
          box-shadow: 0 40px 60px rgba(0,0,0,0.3);
        }
        .login-v2-left {
          flex: 1; padding: 60px; display: flex; flex-direction: column; justify-content: center;
          background: rgba(255,255,255,0.03); border-right: 1px solid rgba(255,255,255,0.05);
        }
        .v2-branding { display: flex; align-items: center; gap: 12px; color: #10B981; font-weight: 700; margin-bottom: 40px; }
        .v2-logo { width: 40px; height: 40px; background: #065F46; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .login-v2-left h1 { color: #fff; font-size: 42px; margin-bottom: 20px; font-weight: 800; line-height: 1.1; }
        .login-v2-left p { color: #A7F3D0; line-height: 1.6; margin-bottom: 40px; }
        
        .v2-toggle { display: flex; gap: 10px; background: rgba(0,0,0,0.2); padding: 5px; border-radius: 12px; align-self: flex-start; }
        .v2-toggle button {
          border: none; background: none; color: #A7F3D0; padding: 8px 20px; 
          border-radius: 8px; cursor: pointer; transition: 0.3s; font-weight: 600;
        }
        .v2-toggle button.active { background: #10B981; color: #fff; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); }

        .login-v2-right { flex: 1.2; padding: 60px; display: flex; flex-direction: column; justify-content: center; background: #fff; }
        .v2-input-group { margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px; }
        .v2-input-group label { font-size: 13px; font-weight: 600; color: #374151; }
        .v2-input-group input, .v2-input-group select {
          padding: 12px 16px; border: 1px solid #E5E7EB; border-radius: 12px; font-size: 15px; outline: none; transition: 0.3s;
        }
        .v2-input-group input:focus { border-color: #10B981; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); }
        .v2-form-row { display: flex; gap: 20px; }
        .v2-form-row .v2-input-group { flex: 1; }
        
        .v2-main-btn {
          width: 100%; padding: 14px; background: #065F46; color: #fff; border: none; 
          border-radius: 12px; font-weight: 700; font-size: 16px; cursor: pointer; transition: 0.3s; margin-top: 10px;
        }
        .v2-main-btn:hover { background: #064E3B; transform: translateY(-2px); }
        .v2-err-msg { color: #DC2626; font-size: 13px; font-weight: 600; margin-bottom: 15px; text-align: center; }
        .v2-succ-msg { color: #059669; font-size: 13px; font-weight: 600; margin-bottom: 15px; text-align: center; }
        
        .scroll-form { max-height: 400px; overflow-y: auto; padding-right: 10px; }
        .scroll-form::-webkit-scrollbar { width: 6px; }
        .scroll-form::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        
        .v2-fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 950px) {
          .login-v2-glass { flex-direction: column; width: 100%; height: auto; border-radius: 0; margin: 0; }
          .login-v2-left { padding: 40px; }
          .login-v2-right { padding: 40px; border-radius: 30px 30px 0 0; margin-top: -30px; }
          .scroll-form { max-height: none; }
        }
      `}</style>
      
      {showDigiLocker && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 10003, fontFamily: "system-ui, -apple-system, sans-serif"
        }}>
          <div style={{
            background: "#fff", padding: "26px", borderRadius: "20px",
            width: "380px", boxShadow: "0 20px 48px rgba(0,0,0,0.3)",
            border: "1px solid #E5E7EB", boxSizing: "border-box"
          }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 24 }}>🔒</span>
                <div>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#1E3A8A" }}>DigiLocker Gateway</h4>
                  <p style={{ margin: 0, fontSize: 8, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5 }}>Ministry of IT, India</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => { setShowDigiLocker(false); setDigiLockerStep("aadhaar"); }}
                style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#9CA3AF" }}
              >
                ×
              </button>
            </div>

            {digiLockerStep === "aadhaar" ? (
              <div>
                <p style={{ fontSize: 12.5, color: "#4B5563", marginBottom: 15, lineHeight: 1.5 }}>
                  Enter your 12-digit Aadhaar number to sync your verified profile documents from the Government registry.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 15 }}>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: "#374151" }}>Aadhaar Number</label>
                  <input 
                    type="text" 
                    placeholder="1234-5678-9101" 
                    value={digiLockerAadhaar} 
                    onChange={e => setDigiLockerAadhaar(e.target.value)} 
                    style={{ padding: "10px 14px", border: "1px solid #D1D5DB", borderRadius: "10px", outline: "none", fontSize: 14 }}
                    maxLength={14}
                    required 
                  />
                </div>
                <button 
                  type="button" 
                  className="v2-main-btn"
                  onClick={handleSendAadhaarOtp}
                  disabled={digiLockerLoading}
                  style={{ background: "#2563EB", marginTop: 0 }}
                >
                  {digiLockerLoading ? "Sending OTP..." : "Get Verification OTP"}
                </button>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: 12.5, color: "#4B5563", marginBottom: 15, lineHeight: 1.5 }}>
                  Enter the 6-digit OTP sent to your Aadhaar-linked mobile number (**-****-3210).
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 15 }}>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: "#374151" }}>Enter OTP Code</label>
                  <input 
                    type="text" 
                    placeholder="123456" 
                    value={digiLockerOtp} 
                    onChange={e => setDigiLockerOtp(e.target.value)} 
                    style={{ padding: "10px 14px", border: "1px solid #D1D5DB", borderRadius: "10px", outline: "none", fontSize: 14, letterSpacing: "2px", textAlign: "center" }}
                    maxLength={6}
                    required 
                  />
                </div>
                <button 
                  type="button" 
                  className="v2-main-btn"
                  onClick={handleVerifyAadhaarOtp}
                  disabled={digiLockerLoading}
                  style={{ background: "#10B981", marginTop: 0 }}
                >
                  {digiLockerLoading ? "Verifying..." : "Verify & Log In"}
                </button>
              </div>
            )}
            
            <div style={{ marginTop: 22, textAlign: "center", fontSize: 9.5, color: "#9CA3AF", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
              <span>🇮🇳</span> National e-Governance Division (NeGD)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}