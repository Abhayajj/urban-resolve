import React, { useState, useEffect } from "react";
import API_URL from '../../config.js';

export default function FileComplaintPanel({ activePanel, setActivePanel, aiDraft, clearAiDraft, lang = "EN" }) {
  const [category, setCategory] = useState("Water Supply");
  const [subCategory, setSubCategory] = useState("No Water Supply");
  const [priority, setPriority] = useState("Medium");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ward, setWard] = useState("Ward 7");
  const [block, setBlock] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const t = {
    EN: {
      title: "File a Complaint",
      desc: "Report a civic issue in your area",
      step1: "Category",
      step2: "Details",
      step3: "Location",
      step4: "Submit",
      subTitle1: "Step 1 — Select Category",
      subTitle2: "Step 2 — Details",
      subTitle3: "Step 3 — Location",
      lblSubCategory: "Sub-category",
      lblPriority: "Priority",
      lblTitle: "Title",
      lblDescription: "Description",
      lblWard: "Ward",
      lblBlock: "Block",
      lblAddress: "Full Address / Landmark",
      btnLocation: "Use My Current Location",
      btnSubmit: "Submit Complaint",
      btnSubmitting: "Submitting...",
      mapMockTitle: "Location Map",
      mapMockTap: "Tap to adjust pin",
      aiScannerTitle: "AI Credibility & Duplicate Scan",
      aiScannerBtn: "Run Scanner",
      aiScannerScanning: "Scanning...",
      aiScannerUnique: "AI Verified Unique",
      aiScannerDup: "Potential Duplicate",
      digiLockerNote: "🔒 Grievance authenticated via citizen Aadhaar e-verification profile."
    },
    HI: {
      title: "शिकायत दर्ज करें",
      desc: "अपने क्षेत्र में नागरिक समस्या की रिपोर्ट करें",
      step1: "श्रेणी",
      step2: "विवरण",
      step3: "स्थान",
      step4: "सबमिट",
      subTitle1: "चरण 1 — श्रेणी चुनें",
      subTitle2: "चरण 2 — विवरण भरें",
      subTitle3: "चरण 3 — स्थान की जानकारी",
      lblSubCategory: "उप-श्रेणी",
      lblPriority: "प्राथमिकता",
      lblTitle: "शीर्षक",
      lblDescription: "विवरण",
      lblWard: "वार्ड",
      lblBlock: "ब्लॉक",
      lblAddress: "पूरा पता / लैंडमार्क",
      btnLocation: "मेरे वर्तमान स्थान का उपयोग करें",
      btnSubmit: "शिकायत दर्ज करें",
      btnSubmitting: "दर्ज की जा रही है...",
      mapMockTitle: "नक्शा",
      mapMockTap: "पिन समायोजित करने के लिए टैप करें",
      aiScannerTitle: "एआई विश्वसनीयता और डुप्लिकेट स्कैन",
      aiScannerBtn: "स्कैनर चलाएं",
      aiScannerScanning: "स्कैन किया जा रहा है...",
      aiScannerUnique: "एआई द्वारा सत्यापित अद्वितीय",
      aiScannerDup: "संभावित डुप्लिकेट",
      digiLockerNote: "🔒 नागरिक आधार ई-सत्यापन प्रोफाइल के माध्यम से शिकायत सत्यापित की गई।"
    }
  }[lang];
  const [duplicateResult, setDuplicateResult] = useState(null);
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);

  useEffect(() => {
    if (aiDraft) {
      setCategory(aiDraft.category);
      setSubCategory(aiDraft.subCategory || subCategoriesMap[aiDraft.category][0]);
      setPriority(aiDraft.priority);
      setTitle(aiDraft.title);
      setDescription(aiDraft.description);
      clearAiDraft();
    }
  }, [aiDraft]);

  const handleCheckDuplicates = async () => {
    if (!title || !description || !ward) {
      alert("Please fill in Title, Description, and Ward first to run a duplication scan.");
      return;
    }
    setCheckingDuplicates(true);
    setDuplicateResult(null);
    try {
      const token = localStorage.getItem("citizen_token");
      const res = await fetch(API_URL + "/ai/detect-duplicate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, ward })
      });
      if (res.ok) {
        const data = await res.json();
        setDuplicateResult(data);
      } else {
        alert("Duplication scan failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error scanning for duplicates");
    } finally {
      setCheckingDuplicates(false);
    }
  };

  const subCategoriesMap = {
    "Water Supply": ["No Water Supply", "Pipe Leakage", "Contamination", "Low Pressure"],
    "Roads": ["Potholes", "Broken Pavement", "Waterlogging"],
    "Sanitation": ["Garbage Collection", "Blocked Drain", "Public Toilet"],
    "Electricity": ["Power Outage", "Flickering Lights", "Sparking Pole"],
    "Street Lights": ["Not Working", "Pole Damage"],
    "Other": ["General Query"]
  };

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    setSubCategory(subCategoriesMap[cat][0]);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Use OpenStreetMap Nominatim for free reverse geocoding
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.display_name) {
            setLocation(data.display_name);
          } else {
            setLocation(`Lat: ${latitude}, Lon: ${longitude}`);
          }
        } catch (err) {
          setLocation(`Lat: ${latitude}, Lon: ${longitude}`);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setLoading(false);
        alert("Unable to retrieve your location: " + error.message);
      }
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("citizen_token");
      
      if (!token) {
        alert("Please login first!");
        setActivePanel("cp-login");
        return;
      }

      if (!title || !description || !location || !ward) {
        alert("Please fill all required fields");
        setLoading(false);
        return;
      }

      const res = await fetch(API_URL + "/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          category,
          subCategory,
          priority,
          title,
          description,
          location,
          ward
        })
      });

      if (res.ok) {
        alert("Complaint Submitted Successfully!");
        setTitle("");
        setDescription("");
        setLocation("");
        setActivePanel("cp-track");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to submit");
      }
    } catch (err) {
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ═══ FILE COMPLAINT ═══ */}
      <div
        className={`panel ${activePanel === "cp-file" ? "active" : ""}`}
        id="cp-file"
      >
        <div className="page-intro">
          <h2>{t.title}</h2>
          <p>{t.desc}</p>
        </div>

        <div className="step-bar" style={{ marginBottom: 22 }}>
          <div className="step-item active">
            <div className="step-num">1</div> {t.step1}
          </div>

          <div className="step-sep" />

          <div className="step-item todo">
            <div className="step-num">2</div> {t.step2}
          </div>

          <div className="step-sep" />

          <div className="step-item todo">
            <div className="step-num">3</div> {t.step3}
          </div>

          <div className="step-sep" />

          <div className="step-item todo">
            <div className="step-num">4</div> {t.step4}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 14 }}>

          {/* LEFT SIDE */}
          <div>

            <div className="card" style={{ marginBottom: 14 }}>
              <div className="card-hd">
                <span className="card-title">{t.subTitle1}</span>
              </div>

              <div className="cat-grid">
                {[
                  { name: "Water Supply", displayName: lang === "EN" ? "Water Supply" : "जल आपूर्ति", icon: <path d="M2 12h20" />, color: "#3B82F6", bg: "#EFF6FF" },
                  { name: "Roads", displayName: lang === "EN" ? "Roads" : "सड़कें", icon: <path d="M3 9h18M3 15h18" />, color: "#16A34A", bg: "#F0FDF4" },
                  { name: "Sanitation", displayName: lang === "EN" ? "Sanitation" : "स्वच्छता", icon: <path d="M3 9l9-7 9 7v11H3z" />, color: "#EF4444", bg: "#FEF2F2" },
                  { name: "Electricity", displayName: lang === "EN" ? "Electricity" : "बिजली", icon: <circle cx={12} cy={12} r={5} />, color: "#D97706", bg: "#FEF3C7" },
                  { name: "Street Lights", displayName: lang === "EN" ? "Street Lights" : "स्ट्रीट लाइट", icon: <circle cx={12} cy={12} r={10} />, color: "#7C3AED", bg: "#F5F3FF" },
                  { name: "Other", displayName: lang === "EN" ? "Other" : "अन्य", icon: <><circle cx={12} cy={12} r={10} /><line x1={12} y1={8} x2={12} y2={12} /></>, color: "var(--gray-500)", bg: "var(--gray-100)" }
                ].map((c) => (
                  <div
                    key={c.name}
                    className={`cat-card ${category === c.name ? "picked" : ""}`}
                    onClick={() => handleCategoryClick(c.name)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="cat-card-icon" style={{ background: c.bg }}>
                      <svg width={18} height={18} fill="none" stroke={c.color} strokeWidth={2} viewBox="0 0 24 24">
                        {c.icon}
                      </svg>
                    </div>
                    <div className="cat-card-name">{c.displayName}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* DETAILS */}
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="card-hd">
                <span className="card-title">{t.subTitle2}</span>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label req">{t.lblSubCategory}</label>
                  <select className="form-input" value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>
                    {subCategoriesMap[category].map(sc => (
                      <option key={sc} value={sc}>{sc}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label req">{t.lblPriority}</label>
                  <select className="form-input" value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label req">{t.lblTitle}</label>
                <input
                  className="form-input"
                  placeholder="Brief complaint title…"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label req">{t.lblDescription}</label>
                <textarea
                  className="form-input"
                  placeholder="Detailed description of the issue..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* AI Duplicate Scanner Box */}
              <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: "#F3F4F6", border: "1px dashed #D1D5DB" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>🤖 {t.aiScannerTitle}</span>
                  <button 
                    type="button" 
                    className="btn btn-ghost btn-sm"
                    onClick={handleCheckDuplicates}
                    disabled={checkingDuplicates || !title || !description}
                    style={{ background: "#FFF" }}
                  >
                    {checkingDuplicates ? t.aiScannerScanning : "🔍 " + t.aiScannerBtn}
                  </button>
                </div>
                {duplicateResult && (
                  <div style={{ marginTop: 8, padding: 8, borderRadius: 6, fontSize: 12, background: duplicateResult.isDuplicate ? "#FEF2F2" : "#F0FDF4", border: duplicateResult.isDuplicate ? "1px solid #FCA5A5" : "1px solid #BBF7D0", color: duplicateResult.isDuplicate ? "#991B1B" : "#166534" }}>
                    <strong>{duplicateResult.isDuplicate ? `⚠️ ${t.aiScannerDup} (${duplicateResult.matchPercentage}% match)` : `✅ ${t.aiScannerUnique}`}</strong>
                    <p style={{ margin: "4px 0 0", fontSize: 11, color: duplicateResult.isDuplicate ? "#B91C1C" : "#15803D" }}>{duplicateResult.reason}</p>
                  </div>
                )}
              </div>

              {/* DigiLocker e-Verification status */}
              {JSON.parse(localStorage.getItem("citizen_data") || "{}").isDigiLockerVerified && (
                <div style={{ marginTop: 12, padding: "10px 14px", background: "#ECFDF5", border: "1.5px solid #A7F3D0", borderRadius: 10, fontSize: 12, color: "#065F46", display: "flex", alignItems: "center", gap: 6 }}>
                  <span>{t.digiLockerNote}</span>
                </div>
              )}
            </div>

            {/* LOCATION */}
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="card-hd">
                <span className="card-title">{t.subTitle3}</span>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label req">{t.lblWard}</label>
                  <select className="form-input" value={ward} onChange={(e) => setWard(e.target.value)}>
                    <option>Ward 1</option>
                    <option>Ward 7</option>
                    <option>Ward 12</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">{t.lblBlock}</label>
                  <input className="form-input" placeholder="Block B" value={block} onChange={(e) => setBlock(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label req">{t.lblAddress}</label>
                <input
                  className="form-input"
                  placeholder="Exact address or landmark"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <button 
                className="btn btn-ghost btn-sm" 
                onClick={handleGetCurrentLocation}
                disabled={loading}
              >
                📍 {loading ? "Fetching..." : t.btnLocation}
              </button>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-primary" style={{ padding: "10px 24px" }} onClick={handleSubmit} disabled={loading}>
                {loading ? t.btnSubmitting : t.btnSubmit}
              </button>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div>
            <div className="card">
              <div className="card-hd">
                <span className="card-title">{t.mapMockTitle}</span>
              </div>

              <div className="map-mock">
                <span>{ward || "Ward"}, {block || "Block"}</span>
                <span style={{ fontSize: 11 }}>{t.mapMockTap}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}