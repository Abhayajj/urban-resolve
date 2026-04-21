import React, { useState } from "react";

export default function FileComplaintPanel({ activePanel, setActivePanel }) {
  const [category, setCategory] = useState("Water Supply");
  const [subCategory, setSubCategory] = useState("No Water Supply");
  const [priority, setPriority] = useState("Medium");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ward, setWard] = useState("Ward 7");
  const [block, setBlock] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

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

      const res = await fetch("http://localhost:5000/api/v1/complaints", {
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
          <h2>File a Complaint</h2>
          <p>Report a civic issue in your area</p>
        </div>

        <div className="step-bar" style={{ marginBottom: 22 }}>
          <div className="step-item active">
            <div className="step-num">1</div> Category
          </div>

          <div className="step-sep" />

          <div className="step-item todo">
            <div className="step-num">2</div> Details
          </div>

          <div className="step-sep" />

          <div className="step-item todo">
            <div className="step-num">3</div> Location
          </div>

          <div className="step-sep" />

          <div className="step-item todo">
            <div className="step-num">4</div> Submit
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 14 }}>

          {/* LEFT SIDE */}
          <div>

            <div className="card" style={{ marginBottom: 14 }}>
              <div className="card-hd">
                <span className="card-title">Step 1 — Select Category</span>
              </div>

              <div className="cat-grid">
                {[
                  { name: "Water Supply", icon: <path d="M2 12h20" />, color: "#3B82F6", bg: "#EFF6FF" },
                  { name: "Roads", icon: <path d="M3 9h18M3 15h18" />, color: "#16A34A", bg: "#F0FDF4" },
                  { name: "Sanitation", icon: <path d="M3 9l9-7 9 7v11H3z" />, color: "#EF4444", bg: "#FEF2F2" },
                  { name: "Electricity", icon: <circle cx={12} cy={12} r={5} />, color: "#D97706", bg: "#FEF3C7" },
                  { name: "Street Lights", icon: <circle cx={12} cy={12} r={10} />, color: "#7C3AED", bg: "#F5F3FF" },
                  { name: "Other", icon: <><circle cx={12} cy={12} r={10} /><line x1={12} y1={8} x2={12} y2={12} /></>, color: "var(--gray-500)", bg: "var(--gray-100)" }
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
                    <div className="cat-card-name">{c.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* DETAILS */}
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="card-hd">
                <span className="card-title">Step 2 — Details</span>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label req">Sub-category</label>
                  <select className="form-input" value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>
                    {subCategoriesMap[category].map(sc => (
                      <option key={sc} value={sc}>{sc}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label req">Priority</label>
                  <select className="form-input" value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label req">Title</label>
                <input
                  className="form-input"
                  placeholder="Brief complaint title…"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label req">Description</label>
                <textarea
                  className="form-input"
                  placeholder="Detailed description of the issue..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            {/* LOCATION */}
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="card-hd">
                <span className="card-title">Step 3 — Location</span>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label req">Ward</label>
                  <select className="form-input" value={ward} onChange={(e) => setWard(e.target.value)}>
                    <option>Ward 1</option>
                    <option>Ward 7</option>
                    <option>Ward 12</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Block</label>
                  <input className="form-input" placeholder="Block B" value={block} onChange={(e) => setBlock(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label req">Full Address / Landmark</label>
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
                📍 {loading ? "Fetching..." : "Use My Current Location"}
              </button>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-primary" style={{ padding: "10px 24px" }} onClick={handleSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Submit Complaint"}
              </button>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div>
            <div className="card">
              <div className="card-hd">
                <span className="card-title">Location Map</span>
              </div>

              <div className="map-mock">
                <span>{ward || "Ward"}, {block || "Block"}</span>
                <span style={{ fontSize: 11 }}>Tap to adjust pin</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}