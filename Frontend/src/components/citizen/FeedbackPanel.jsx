import React, { useState, useEffect } from "react";
import API_URL from '../../config.js';

export default function FeedbackPanel({ activePanel }) {
  const [resolvedComplaints, setResolvedComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState({}); // { id: { rating: 5, comment: "" } }

  const fetchResolved = async () => {
    try {
      const token = localStorage.getItem("citizen_token");
      const res = await fetch(API_URL + "/complaints/my", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        // Filter resolved ones that don't have feedback yet
        const resolved = data.data.filter(c => (c.status === "Resolved" || c.status === "Completed") && !c.feedbackRating);
        setResolvedComplaints(resolved);
        
        // Initialize state for each
        const initialFeedbacks = {};
        resolved.forEach(c => {
          initialFeedbacks[c._id] = { rating: 5, comment: "" };
        });
        setFeedbacks(initialFeedbacks);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResolved();
  }, []);

  const handleRatingChange = (id, rating) => {
    setFeedbacks(prev => ({
      ...prev,
      [id]: { ...prev[id], rating }
    }));
  };

  const handleCommentChange = (id, comment) => {
    setFeedbacks(prev => ({
      ...prev,
      [id]: { ...prev[id], comment }
    }));
  };

  const submitFeedback = async (id) => {
    try {
      const token = localStorage.getItem("citizen_token");
      const { rating, comment } = feedbacks[id];
      
      const res = await fetch(`${API_URL}/complaints/${id}/feedback`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });

      if (res.ok) {
        alert("Thank you! Your feedback has been recorded.");
        fetchResolved(); // Refresh
      } else {
        alert("Failed to submit feedback");
      }
    } catch (err) {
      alert("Connection error");
    }
  };

  const renderStars = (id, currentRating) => {
    return [1, 2, 3, 4, 5].map((num) => (
      <span
        key={num}
        style={{ cursor: "pointer", fontSize: 22, color: num <= currentRating ? "#F59E0B" : "#CBD5E1", marginRight: 4 }}
        onClick={() => handleRatingChange(id, num)}
      >
        ★
      </span>
    ));
  };

  return (
    <div className={`panel ${activePanel === "cp-feedback" ? "active" : ""}`} id="cp-feedback">
      <div className="page-intro">
        <h2 style={{ fontSize: 24, fontWeight: 800 }}>Feedback</h2>
        <p style={{ color: "#64748B" }}>Rate city services and help us improve resolution quality</p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#94A3B8" }}>Loading your resolved cases...</div>
      ) : resolvedComplaints.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 60, borderRadius: 24 }}>
            <div style={{ fontSize: 40, marginBottom: 15 }}>✨</div>
            <h3 style={{ fontWeight: 800, marginBottom: 8 }}>All set!</h3>
            <p style={{ color: "#64748B", maxWidth: 300, margin: "0 auto" }}>You have no pending feedbacks. Thank you for staying active in Urban Resolve.</p>
        </div>
      ) : (
        <div className="grid-2">
          {resolvedComplaints.map((c) => (
            <div key={c._id} className="card" style={{ borderRadius: 24, padding: 28, borderLeft: "6px solid #10B981" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, background: "#F1F5F9", padding: "4px 8px", borderRadius: 6, color: "#475569" }}>
                    #{c._id.slice(-6).toUpperCase()}
                  </span>
                  <h4 style={{ margin: "10px 0 4px", fontSize: 16, fontWeight: 800 }}>{c.title}</h4>
                  <p style={{ fontSize: 12, color: "#64748B" }}>{c.category} · Resolved recently</p>
                </div>
                <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#10B981", background: "#ECFDF5", padding: "4px 10px", borderRadius: 8 }}>COMPLETED</div>
                </div>
              </div>

              <div style={{ marginBottom: 20, padding: 18, background: "#F8FAFC", borderRadius: 16 }}>
                <label className="form-label" style={{ fontSize: 11 }}>Official Resolution Note</label>
                <p style={{ fontSize: 13, color: "#334155", fontStyle: "italic" }}>"{c.resolutionNotes || "Issue resolved by team."}"</p>
              </div>

              <div className="form-group">
                <label className="form-label">How was your experience?</label>
                <div style={{ marginBottom: 10 }}>
                  {renderStars(c._id, feedbacks[c._id]?.rating || 5)}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Comments (Optional)</label>
                <textarea
                  className="form-input"
                  rows={2}
                  placeholder="Tell us what you liked or what could be better..."
                  value={feedbacks[c._id]?.comment || ""}
                  onChange={(e) => handleCommentChange(c._id, e.target.value)}
                  style={{ borderRadius: 12 }}
                />
              </div>

              <button className="btn btn-primary" style={{ width: "100%", borderRadius: 12 }} onClick={() => submitFeedback(c._id)}>
                Submit Rating
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}