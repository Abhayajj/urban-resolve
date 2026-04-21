import React, { useState, useEffect } from "react";

export default function CommunicationsPanel({ activePanel, user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // For demo/simulated feel, we still keep some initial context
  const demoMessages = [
    { sender: "Admin", content: "Please prioritize resolution in Ward 7.", time: "10:00 AM", isMine: false },
    { sender: "You", content: "Understood, team dispatched.", time: "10:15 AM", isMine: true }
  ];

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessage = {
      sender: "You",
      content: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true
    };
    setMessages([...messages, newMessage]);
    setInput("");
    // In a real app, this would hit the API we just created
  };

  useEffect(() => {
    if (activePanel === "dp-comms") {
        setMessages(demoMessages);
    }
  }, [activePanel]);

  return (
    <div className={`panel ${activePanel === "dp-comms" ? "active" : ""}`} id="dp-comms">
      <div className="page-intro">
        <h2 style={{fontSize: 22, fontWeight: 800}}>Operations Center Communications</h2>
        <p>Real-time channel with Admin and Citizens</p>
      </div>

      <div className="grid-2">
        {/* Admin Channel */}
        <div className="card" style={{ display: "flex", flexDirection: "column", height: "550px", borderRadius: 24, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #F1F5F9", background: "#0F172A", color: "#fff" }}>
            <div style={{ fontSize: 14, fontWeight: 800 }}>Admin Command Channel</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Direct link to Super Admin</div>
          </div>

          <div style={{ flex: 1, padding: 24, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ 
                alignSelf: m.isMine ? "flex-end" : "flex-start",
                maxWidth: "80%"
              }}>
                <div style={{ 
                  padding: "12px 18px", 
                  borderRadius: m.isMine ? "18px 18px 2px 18px" : "18px 18px 18px 2px",
                  background: m.isMine ? "#F59E0B" : "#F1F5F9",
                  color: m.isMine ? "#fff" : "#1E293B",
                  fontSize: 14, fontWeight: 600, boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                }}>
                  {m.content}
                </div>
                <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 4, textAlign: m.isMine ? "right" : "left", fontWeight: 700 }}>
                  {m.sender} · {m.time}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: 20, borderTop: "1px solid #F1F5F9", display: "flex", gap: 12 }}>
            <input 
              style={{ flex: 1, padding: "12px 18px", borderRadius: 12, border: "2px solid #F1F5F9", outline: "none", fontSize: 14 }}
              placeholder="Send instruction to admin..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              style={{ width: 48, height: 48, borderRadius: 12, background: "#0F172A", border: "none", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Citizen Interaction Channel */}
        <div className="card" style={{ display: "flex", flexDirection: "column", height: "550px", borderRadius: 24, padding: 0, overflow: "hidden" }}>
           <div style={{ padding: "20px 24px", borderBottom: "1px solid #F1F5F9", background: "#F59E0B", color: "#fff" }}>
            <div style={{ fontSize: 14, fontWeight: 800 }}>Citizen Support Feed</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>Reply to active complaint queries</div>
          </div>

          <div style={{ flex: 1, padding: 24, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "#94A3B8" }}>
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{marginBottom: 15, opacity: 0.5}}>
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Select a complaint to start chat</div>
            <p style={{ fontSize: 12, textAlign: "center", marginTop: 5 }}>No active citizen queries assigned to you</p>
          </div>
        </div>
      </div>
    </div>
  );
}