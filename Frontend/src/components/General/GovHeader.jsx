import React, { useState, useEffect } from "react";

export default function GovHeader() {
  const [lang, setLang] = useState(() => localStorage.getItem("active_lang") || "EN");
  const [textSize, setTextSize] = useState("normal"); // 'small', 'normal', 'large'
  const [contrast, setContrast] = useState(() => localStorage.getItem("accessibility_contrast") || "normal");

  useEffect(() => {
    const handleLang = (e) => {
      setLang(e.detail);
    };
    document.addEventListener("langChange", handleLang);
    return () => document.removeEventListener("langChange", handleLang);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (contrast === "high") {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
    localStorage.setItem("accessibility_contrast", contrast);
  }, [contrast]);

  const toggleContrast = () => {
    setContrast(prev => prev === "normal" ? "high" : "normal");
  };

  const handleTextSize = (size) => {
    setTextSize(size);
    const root = document.documentElement;
    if (size === "small") {
      root.style.fontSize = "16px";
    } else if (size === "large") {
      root.style.fontSize = "20px";
    } else {
      root.style.fontSize = "18px"; // default from index.css
    }
  };

  return (
    <div className="gov-header-wrapper">
      {/* Tricolor top border indicator */}
      <div className="gov-tricolor-strip">
        <div style={{ background: "#FF9933", height: "3px", flex: 1 }} />
        <div style={{ background: "#FFFFFF", height: "3px", flex: 1 }} />
        <div style={{ background: "#138808", height: "3px", flex: 1 }} />
      </div>

      <div className="gov-header-content">
        {/* Left Side: National Portal Info */}
        <div className="gov-left">
          <span className="gov-flag-emoji">🇮🇳</span>
          <span className="gov-dept-text">
            {lang === "EN" 
              ? "MINISTRY OF HOUSING AND URBAN AFFAIRS | GOVERNMENT OF INDIA" 
              : "आवासन और शहरी कार्य मंत्रालय | भारत सरकार"}
          </span>
          <span className="gov-dot-gov-badge">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: 4 }}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Secure .gov.in Portal
          </span>
        </div>

        {/* Right Side: Accessibility & Language */}
        <div className="gov-right">
          {/* Screen Reader Link */}
          <span className="gov-acc-btn hide-mobile" onClick={() => alert("Screen reader accessibility activated.")} title="Screen Reader Access">
            ♿ Accessibility Support
          </span>

          <span className="gov-divider" />

          {/* Text Size Controls */}
          <div className="gov-text-controls">
            <button 
              className={`gov-size-btn ${textSize === "small" ? "active" : ""}`} 
              onClick={() => handleTextSize("small")}
              title="Decrease Font Size"
            >
              A-
            </button>
            <button 
              className={`gov-size-btn ${textSize === "normal" ? "active" : ""}`} 
              onClick={() => handleTextSize("normal")}
              title="Normal Font Size"
            >
              A
            </button>
            <button 
              className={`gov-size-btn ${textSize === "large" ? "active" : ""}`} 
              onClick={() => handleTextSize("large")}
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          <span className="gov-divider" />

          <button 
            className={`gov-size-btn ${contrast === "high" ? "active" : ""}`} 
            onClick={toggleContrast}
            title="Toggle High Contrast Mode"
            style={{ fontSize: "10px", display: "flex", alignItems: "center", gap: 3 }}
          >
            🌓 {contrast === "high" ? (lang === "EN" ? "Normal Contrast" : "सामान्य कंट्रास्ट") : (lang === "EN" ? "High Contrast" : "उच्च कंट्रास्ट")}
          </button>

          <span className="gov-divider" />

          {/* Language Switcher */}
          <div className="gov-lang-controls">
            <button 
              className={`gov-lang-btn ${lang === "EN" ? "active" : ""}`} 
              onClick={() => {
                setLang("EN");
                localStorage.setItem("active_lang", "EN");
                document.dispatchEvent(new CustomEvent("langChange", { detail: "EN" }));
              }}
            >
              English
            </button>
            <button 
              className={`gov-lang-btn ${lang === "HI" ? "active" : ""}`} 
              onClick={() => {
                setLang("HI");
                localStorage.setItem("active_lang", "HI");
                document.dispatchEvent(new CustomEvent("langChange", { detail: "HI" }));
              }}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </div>

      {/* Verification Dropdown Banner */}
      <div className="gov-info-strip">
        <p>
          {lang === "EN" 
            ? "Official website of Urban Resolve Grievance Redressal platform. All logins are secure and verified via Aadhaar OTP standards."
            : "अर्बन रिज़ॉल्यूशन शिकायत निवारण मंच की आधिकारिक वेबसाइट। सभी लॉगिन आधार ओटीपी मानकों के माध्यम से सुरक्षित और सत्यापित हैं।"}
        </p>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .gov-header-wrapper {
          width: 100%;
          background: #111827;
          font-family: system-ui, -apple-system, sans-serif;
          border-bottom: 1px solid #1F2937;
          position: relative;
          z-index: 1001;
        }
        .gov-tricolor-strip {
          display: flex;
          width: 100%;
        }
        .gov-header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 20px;
          color: #E5E7EB;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.3px;
        }
        .gov-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .gov-flag-emoji {
          font-size: 14px;
        }
        .gov-dept-text {
          color: #9CA3AF;
          font-weight: 600;
        }
        .gov-dot-gov-badge {
          display: flex;
          align-items: center;
          background: rgba(16, 185, 129, 0.15);
          color: #34D399;
          padding: 2px 8px;
          border-radius: 4px;
          border: 1px solid rgba(16, 185, 129, 0.2);
          font-size: 10px;
        }
        .gov-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .gov-acc-btn {
          cursor: pointer;
          color: #9CA3AF;
          transition: color 0.2s;
        }
        .gov-acc-btn:hover {
          color: #FFF;
        }
        .gov-divider {
          width: 1px;
          height: 12px;
          background: #374151;
        }
        .gov-text-controls, .gov-lang-controls {
          display: flex;
          gap: 4px;
        }
        .gov-size-btn, .gov-lang-btn {
          background: none;
          border: none;
          color: #9CA3AF;
          font-size: 11px;
          cursor: pointer;
          padding: 2px 6px;
          border-radius: 3px;
          font-weight: 600;
          transition: all 0.2s;
        }
        .gov-size-btn:hover, .gov-lang-btn:hover {
          color: #FFF;
          background: #1F2937;
        }
        .gov-size-btn.active, .gov-lang-btn.active {
          color: #FF9933;
          background: rgba(255, 153, 51, 0.1);
        }
        .gov-info-strip {
          background: #1F2937;
          color: #9CA3AF;
          font-size: 10px;
          padding: 4px 20px;
          text-align: left;
          border-top: 1px solid #374151;
        }
        .gov-info-strip p {
          margin: 0;
        }
        @media (max-width: 768px) {
          .hide-mobile {
            display: none;
          }
          .gov-header-content {
            flex-direction: column;
            gap: 6px;
            align-items: flex-start;
          }
          .gov-right {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}} />
    </div>
  );
}
