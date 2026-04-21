import React, { useState } from "react";
import API_URL from '../../config.js';

export default function DeptLoginPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("Water Supply");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const res = await fetch(API_URL + "/admin/login-department", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, departmentName: department })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("dept_token", data.token);
        localStorage.setItem("dept_data", JSON.stringify(data));
        window.location.reload();
      } else {
        setError(data.message || "Invalid credentials for this department");
      }
    } catch (err) {
      setError("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dept-login-screen">
      {/* Dynamic Background Shapes */}
      <div className="bg-blob b1"></div>
      <div className="bg-blob b2"></div>
      <div className="bg-blob b3"></div>

      <div className="auth-card glass-premium">
        {/* Decorative Top Accent */}
        <div className="top-accent-amber" />

        <div className="auth-header">
            <div className="dept-badge-icon">
                <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            </div>
            <h2>Department Portal</h2>
            <p>Urban Resolve Infrastructure Management</p>
        </div>

        <form onSubmit={handleLogin} className="dept-form">
          <div className="form-group">
            <label className="form-label-v2">Service Department</label>
            <div className="input-with-icon">
                <select 
                    className="form-input-v2"
                    value={department} 
                    onChange={(e) => setDepartment(e.target.value)}
                >
                    <option>Water Supply</option>
                    <option>Roads & Infrastructure</option>
                    <option>Sanitation</option>
                    <option>Electricity Board</option>
                    <option>Street Lights Dept</option>
                </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label-v2">Official Email</label>
            <input 
              className="form-input-v2"
              type="email" 
              placeholder="dept@urbanresolve.gov" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label-v2">Security Token / Password</label>
            <input 
              className="form-input-v2"
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="error-box-v2">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{marginRight: 8}}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <button type="submit" className="dept-submit-btn" disabled={loading}>
            {loading ? "Authenticating..." : "Access Dashboard"}
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{marginLeft: 10}}>
                <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </form>

        <div className="dept-footer">
            <div className="secure-tag">
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"/></svg>
                SECURE GOVERNMENT ACCESS
            </div>
        </div>
      </div>

      <style>{`
        .dept-login-screen {
            height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center;
            background: #F8FAFC; overflow: hidden; position: fixed; top: 0; left: 0; 
            font-family: 'Sora', sans-serif; z-index: 9999;
        }
        .bg-blob {
            position: absolute; border-radius: 50%; filter: blur(100px); z-index: 1; opacity: 0.5;
        }
        .b1 { width: 500px; height: 500px; background: #FEF3C7; top: -100px; left: -100px; }
        .b2 { width: 400px; height: 400px; background: #DBEAFE; bottom: -50px; right: -50px; }
        .b3 { width: 300px; height: 300px; background: #FDE68A; top: 40%; left: 60%; }

        .glass-premium {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.6);
            box-shadow: 0 25px 50px -12px rgba(245, 158, 11, 0.15);
            width: 100%; max-width: 440px; padding: 45px; border-radius: 32px;
            position: relative; z-index: 10; margin: 0 auto;
        }
        .top-accent-amber {
            position: absolute; top: 0; left: 0; right: 0; height: 6px;
            background: linear-gradient(90deg, #F59E0B, #D97706);
            border-radius: 32px 32px 0 0;
        }
        .dept-badge-icon {
            width: 60px; height: 60px; border-radius: 18px;
            background: linear-gradient(135deg, #F59E0B, #B45309);
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 20px; box-shadow: 0 10px 20px -5px rgba(180, 83, 9, 0.3);
        }
        .auth-header h2 { font-size: 24px; font-weight: 800; color: #0F172A; text-align: center; }
        .auth-header p { font-size: 13px; color: #64748B; text-align: center; margin-top: 6px; margin-bottom: 35px; }

        .form-label-v2 { display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 8px; margin-left: 5px; text-transform: uppercase; letter-spacing: 0.5px; }
        .form-input-v2 {
            width: 100%; padding: 15px 20px; background: #fff; border: 2px solid #F1F5F9;
            border-radius: 16px; font-size: 15px; color: #1E293B; transition: all 0.3s;
            font-family: 'Nunito Sans', sans-serif; font-weight: 600;
        }
        .form-input-v2:focus { outline: none; border-color: #F59E0B; box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1); }
        
        .dept-submit-btn {
            width: 100%; padding: 18px; border: none; border-radius: 16px;
            background: #0F172A; color: #fff; font-weight: 700; font-size: 16px;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: all 0.3s; margin-top: 15px;
            box-shadow: 0 10px 20px -5px rgba(15, 23, 42, 0.2);
        }
        .dept-submit-btn:hover { background: #1E293B; transform: translateY(-2px); box-shadow: 0 15px 30px -10px rgba(15, 23, 42, 0.3); }
        .dept-submit-btn:active { transform: translateY(0); }
        .dept-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .error-box-v2 {
            background: #FEF2F2; color: #EF4444; padding: 12px 18px; border-radius: 14px;
            font-size: 13px; font-weight: 700; margin-bottom: 20px; border: 1px solid #FEE2E2;
            display: flex; align-items: center;
        }
        .dept-footer { margin-top: 35px; display: flex; justify-content: center; }
        .secure-tag {
            display: flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 800;
            color: #94A3B8; letter-spacing: 1px;
        }
      `}</style>
    </div>
  );
}