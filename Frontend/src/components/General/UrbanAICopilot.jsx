import React, { useState, useEffect, useRef } from "react";
import API_URL from "../../config";

export default function UrbanAICopilot({ onAutoFill }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Namaste! I am UrbanAI, your official e-Governance assistant. I can help you draft formal grievances, find department SLA resolution times, and answer municipal queries. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentDraft, setCurrentDraft] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    if (!textToSend) setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);

    try {
      const token = localStorage.getItem("citizen_token") || localStorage.getItem("dept_token") || localStorage.getItem("admin_token");
      
      if (!token) {
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            text: "Please sign in to your citizen account first so I can assist you with official grievance actions.",
          },
        ]);
        setLoading(false);
        return;
      }

      const history = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch(API_URL + "/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ message: text, history }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { role: "model", text: data.replyText }]);
        if (data.draftComplaint) {
          setCurrentDraft(data.draftComplaint);
          setMessages((prev) => [
            ...prev,
            {
              role: "model",
              text: `✨ I have prepared a formal grievance draft based on your request. Click the 'Auto-Fill Form' button on the card below to populate the grievance form.`,
              isDraftCard: true,
              draft: data.draftComplaint,
            },
          ]);
        }
      } else {
        const errData = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: "model", text: errData.message || "Failed to contact AI system." },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "Connection error. Please ensure backend is running." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const triggerAutoFill = (draft) => {
    if (onAutoFill) {
      onAutoFill(draft);
      setIsOpen(false); // close chatbot after filling
    } else {
      // Fallback: Dispatch custom event
      const event = new CustomEvent("autoFillGrievance", { detail: draft });
      window.dispatchEvent(event);
      alert("Draft details compiled! Navigating to File Grievance form.");
      setIsOpen(false);
    }
  };

  return (
    <div className="urban-ai-widget">
      {/* Floating Action Button */}
      <button 
        className={`urban-ai-fab ${isOpen ? "open" : ""}`} 
        onClick={() => setIsOpen(!isOpen)}
        title="Ask UrbanAI Assistant"
      >
        <span className="fab-icon">🤖</span>
        {!isOpen && <span className="fab-pulse" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="urban-ai-window">
          {/* Header */}
          <div className="urban-ai-header">
            <div className="hdr-brand">
              <span className="brand-dot" />
              <div>
                <h4>UrbanAI Assistant</h4>
                <p>Official Government Virtual Desk</p>
              </div>
            </div>
            <button className="hdr-close" onClick={() => setIsOpen(false)}>×</button>
          </div>

          {/* Messages */}
          <div className="urban-ai-messages">
            {messages.map((m, idx) => (
              <div key={idx} className={`msg-row ${m.role === "user" ? "mine" : "theirs"}`}>
                <div className="msg-bubble">
                  {m.text}
                  
                  {/* Draft Card rendering */}
                  {m.isDraftCard && m.draft && (
                    <div className="ai-draft-card">
                      <h5>📋 Formulated Grievance Draft</h5>
                      <div className="draft-field">
                        <strong>Title:</strong> {m.draft.title}
                      </div>
                      <div className="draft-field">
                        <strong>Category:</strong> {m.draft.category} ({m.draft.subCategory})
                      </div>
                      <div className="draft-field">
                        <strong>Priority:</strong> <span className={`prio-badge ${m.draft.priority.toLowerCase()}`}>{m.draft.priority}</span>
                      </div>
                      <div className="draft-field">
                        <strong>Formal Description:</strong> {m.draft.description}
                      </div>
                      <button 
                        className="btn-autofill"
                        onClick={() => triggerAutoFill(m.draft)}
                      >
                        ⚡ Auto-Fill Grievance Form
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="msg-row theirs">
                <div className="msg-bubble loading-dots">
                  <span>●</span><span>●</span><span>●</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Shortcuts */}
          <div className="urban-ai-shortcuts">
            <button onClick={() => handleSend("Draft a complaint about dirty water leaking in Ward 7")}>
              💧 Clean Water Issue
            </button>
            <button onClick={() => handleSend("What is the resolution timeline for a broken street light?")}>
              💡 Street Light SLA
            </button>
            <button onClick={() => handleSend("Road potholes in my lane")}>
              🛣️ Pothole Issue
            </button>
          </div>

          {/* Input */}
          <div className="urban-ai-input-box">
            <input
              type="text"
              placeholder="Explain your civic issue in English or Hindi..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={loading}
            />
            <button onClick={() => handleSend()} disabled={loading || !input.trim()}>
              ➤
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .urban-ai-widget {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 10002;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .urban-ai-fab {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1E3A8A, #3B82F6);
          color: white;
          border: none;
          box-shadow: 0 4px 16px rgba(30, 58, 138, 0.4);
          cursor: pointer;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          position: relative;
        }
        .urban-ai-fab:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 20px rgba(30, 58, 138, 0.5);
        }
        .urban-ai-fab.open {
          transform: rotate(90deg);
          background: #374151;
        }
        .fab-pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.4);
          animation: fabPulse 2s infinite;
          z-index: -1;
        }
        @keyframes fabPulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .urban-ai-window {
          position: absolute;
          bottom: 70px;
          right: 0;
          width: 380px;
          height: 500px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 32px rgba(17, 24, 39, 0.15);
          border: 1px solid #E5E7EB;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .urban-ai-header {
          background: #111827;
          color: white;
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .hdr-brand {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .brand-dot {
          width: 8px;
          height: 8px;
          background: #10B981;
          border-radius: 50%;
          animation: dotPulse 1.5s infinite;
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .hdr-brand h4 {
          margin: 0;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.2px;
        }
        .hdr-brand p {
          margin: 1px 0 0;
          font-size: 9px;
          color: #9CA3AF;
          text-transform: uppercase;
          font-weight: 600;
        }
        .hdr-close {
          background: none;
          border: none;
          color: #9CA3AF;
          font-size: 22px;
          cursor: pointer;
        }
        .hdr-close:hover {
          color: white;
        }
        .urban-ai-messages {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          background: #F9FAFB;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .msg-row {
          display: flex;
          width: 100%;
        }
        .msg-row.mine {
          justify-content: flex-end;
        }
        .msg-bubble {
          max-width: 85%;
          padding: 10px 14px;
          border-radius: 14px;
          font-size: 12.5px;
          line-height: 1.5;
        }
        .mine .msg-bubble {
          background: #2563EB;
          color: white;
          border-bottom-right-radius: 2px;
          box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
        }
        .theirs .msg-bubble {
          background: white;
          color: #1F2937;
          border-bottom-left-radius: 2px;
          border: 1px solid #E5E7EB;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        .loading-dots span {
          animation: dotBlink 1.4s infinite both;
          font-size: 14px;
          margin: 0 2px;
          display: inline-block;
        }
        .loading-dots span:nth-child(2) { animation-delay: .2s; }
        .loading-dots span:nth-child(3) { animation-delay: .4s; }
        @keyframes dotBlink {
          0% { opacity: .2; }
          20% { opacity: 1; }
          100% { opacity: .2; }
        }
        .ai-draft-card {
          margin-top: 10px;
          background: #F3F4F6;
          border-radius: 10px;
          padding: 10px;
          border: 1px solid #E5E7EB;
        }
        .ai-draft-card h5 {
          margin: 0 0 8px;
          font-size: 11.5px;
          font-weight: 700;
          color: #1F2937;
        }
        .draft-field {
          font-size: 11px;
          color: #4B5563;
          margin-bottom: 6px;
          line-height: 1.4;
        }
        .draft-field strong {
          color: #111827;
        }
        .prio-badge {
          font-size: 9px;
          font-weight: 700;
          padding: 1px 5px;
          border-radius: 4px;
          text-transform: uppercase;
        }
        .prio-badge.high { background: #FEF2F2; color: #DC2626; border: 1px solid #FCA5A5; }
        .prio-badge.medium { background: #FFFBEB; color: #D97706; border: 1px solid #FDE68A; }
        .prio-badge.low { background: #F0FDF4; color: #16A34A; border: 1px solid #BBF7D0; }
        .btn-autofill {
          width: 100%;
          margin-top: 8px;
          background: #10B981;
          color: white;
          border: none;
          padding: 7px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-autofill:hover {
          background: #059669;
        }
        .urban-ai-shortcuts {
          display: flex;
          gap: 6px;
          padding: 8px 12px;
          background: #F3F4F6;
          border-top: 1px solid #E5E7EB;
          overflow-x: auto;
          white-space: nowrap;
        }
        .urban-ai-shortcuts::-webkit-scrollbar {
          height: 4px;
        }
        .urban-ai-shortcuts button {
          background: white;
          border: 1px solid #D1D5DB;
          border-radius: 20px;
          padding: 4px 10px;
          font-size: 10px;
          font-weight: 600;
          color: #4B5563;
          cursor: pointer;
          transition: all 0.2s;
        }
        .urban-ai-shortcuts button:hover {
          background: #EEF2F6;
          border-color: #9CA3AF;
          color: #1F2937;
        }
        .urban-ai-input-box {
          display: flex;
          padding: 10px;
          border-top: 1px solid #E5E7EB;
          background: white;
        }
        .urban-ai-input-box input {
          flex: 1;
          border: 1px solid #D1D5DB;
          border-radius: 20px;
          padding: 8px 14px;
          font-size: 12px;
          outline: none;
        }
        .urban-ai-input-box input:focus {
          border-color: #3B82F6;
        }
        .urban-ai-input-box button {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #2563EB;
          color: white;
          border: none;
          margin-left: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }
        .urban-ai-input-box button:hover:not(:disabled) {
          background: #1D4ED8;
        }
        .urban-ai-input-box button:disabled {
          background: #9CA3AF;
          cursor: not-allowed;
        }
      `}} />
    </div>
  );
}
