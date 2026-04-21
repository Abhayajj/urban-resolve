import React, { useState } from "react";
import API_URL from '../../config.js';

export default function AdminLoginPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e?.preventDefault();
    try {
      setLoading(true);
      setError("");
      const res = await fetch(API_URL + "/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_data", JSON.stringify(data));
        window.location.reload(); // Refresh to enter dashboard
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
    <div className="login-page-v2 admin-theme">
      <div className="login-bg-shapes">
        <div className="shape s1"></div>
        <div className="shape s2"></div>
      </div>
      
      <div className="login-card-v2 glass">
        <div className="login-header">
          <div className="login-icon-box navy">
            <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h2>Admin Console</h2>
          <p>Secure system-wide access</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="v2-form-group">
            <label>Master Email</label>
            <div className="v2-input-wrap">
              <input 
                type="email" 
                placeholder="admin@urbanresolve.gov.in" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="v2-form-group">
            <label>Security Key</label>
            <div className="v2-input-wrap">
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <div className="v2-error">{error}</div>}

          <button type="submit" className="v2-login-btn navy" disabled={loading}>
            {loading ? "Authenticating..." : "Access Dashboard"}
          </button>
        </form>

        <div className="login-footer-text">
          Protected by 256-bit AES Encryption
        </div>
      </div>

      <style>{`
        .login-page-v2 {
          height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0F172A;
          overflow: hidden;
          position: relative;
          font-family: 'Sora', sans-serif;
        }
        .login-bg-shapes .shape {
          position: absolute;
          filter: blur(80px);
          border-radius: 50%;
          z-index: 1;
        }
        .s1 { width: 400px; height: 400px; background: #1E40AF; top: -100px; left: -100px; opacity: 0.4; }
        .s2 { width: 500px; height: 500px; background: #7C3AED; bottom: -150px; right: -100px; opacity: 0.3; }

        .login-card-v2 {
          width: 100%;
          max-width: 420px;
          padding: 40px;
          border-radius: 24px;
          position: relative;
          z-index: 10;
          backdrop-filter: blur(16px);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          text-align: center;
        }
        .login-header h2 { color: #fff; margin: 15px 0 5px; font-weight: 800; }
        .login-header p { color: #94A3B8; font-size: 14px; margin-bottom: 30px; }

        .login-icon-box {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }
        .login-icon-box.navy { background: linear-gradient(135deg, #2563EB, #1E40AF); }

        .v2-form-group { text-align: left; margin-bottom: 20px; }
        .v2-form-group label { color: #CBD5E1; font-size: 13px; font-weight: 600; display: block; margin-bottom: 8px; margin-left: 4px; }
        .v2-input-wrap input {
          width: 100%;
          padding: 14px 18px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          color: #fff;
          font-size: 15px;
          transition: all 0.3s;
        }
        .v2-input-wrap input:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.08);
          border-color: #3B82F6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
        }

        .v2-login-btn {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 14px;
          color: #fff;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: transform 0.2s, opacity 0.2s;
          margin-top: 10px;
        }
        .v2-login-btn.navy { background: linear-gradient(90deg, #2563EB, #4F46E5); }
        .v2-login-btn:active { transform: scale(0.98); }
        .v2-login-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .v2-error { color: #F87171; background: rgba(239, 68, 68, 0.1); padding: 10px; border-radius: 10px; font-size: 13px; margin-bottom: 20px; border: 1px solid rgba(239, 68, 68, 0.2); }
        .login-footer-text { margin-top: 30px; color: #64748B; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; }
      `}</style>
    </div>
  );
}