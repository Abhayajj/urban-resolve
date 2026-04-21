// ─────────────────────────────────────────────
// COMPONENT: Hero
// The big banner section on the Home page.
// Has animated blobs, stats panel, and live activity chat.
// Props: setPage — to navigate when buttons are clicked
// ─────────────────────────────────────────────

import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("citizen_token");

  return (
    <div className="hero">

      {/* Background layers */}
      <div className="hero-bg" />
      <div className="hero-blob b1" />
      <div className="hero-blob b2" />
      <div className="hero-blob b3" />
      <div className="hero-grid" />

      <div className="hero-inner">

        {/* ── LEFT SIDE: Heading + buttons + trust bar ── */}
        <div>
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            Municipal Corporation · Urban Resolve Initiative 2026
          </div>

          <h1 className="hero-h1">
            Your City.<br />
            <span className="hl">Your Voice.</span><br />
            We <span className="hl2">Act Fast.</span>
          </h1>

          <p className="hero-sub">
            File civic complaints in minutes. Track resolution in real time.
            Communicate directly with city departments — all from one unified platform.
          </p>

          <div className="hero-btns">
            {isLoggedIn ? (
                <button className="hbtn-primary" onClick={() => navigate("/citizen")}>
                  🚀 Go to My Dashboard
                </button>
            ) : (
                <button className="hbtn-primary" onClick={() => navigate("/citizen")}>
                  🚀 Register &amp; File Now
                </button>
            )}
            <button className="hbtn-ghost" onClick={() => navigate("/guidelines")}>
              How It Works →
            </button>
          </div>

          {/* Small avatar row showing registered citizens */}
          <div className="trust-bar">
            <div className="trust-avs">
              {[["RK","#6D28D9"],["PK","#0891B2"],["AM","#059669"],["NR","#D97706"],["VT","#DC2626"]].map(([initials, bg]) => (
                <div key={initials} className="tav" style={{ background: bg }}>{initials}</div>
              ))}
            </div>
            <div className="trust-text">Joined by <strong>8,400+</strong> citizens in Urban Resolve</div>
          </div>
        </div>

        {/* ── RIGHT SIDE: Stats glass card + live activity ── */}
        <div className="hero-right">

          {/* Stats panel */}
          <div className="hero-glass">
            <div className="hg-label">Live Platform Statistics</div>
            <div className="hg-stats">
              <div className="hg-stat"><div className="hg-val">8,421</div><div className="hg-lbl">Citizens</div></div>
              <div className="hg-stat"><div className="hg-val">3,204</div><div className="hg-lbl">Complaints Filed</div></div>
              <div className="hg-stat"><div className="hg-val" style={{ color: "#4ADE80" }}>2,748</div><div className="hg-lbl">✓ Resolved</div></div>
              <div className="hg-stat"><div className="hg-val" style={{ color: "#FCD34D" }}>4.2d</div><div className="hg-lbl">Avg Time</div></div>
            </div>
          </div>

          {/* Live chat preview */}
          <div className="hero-chat-preview">
            <div className="hcp-title">Live Activity</div>
            <div className="hcp-msg">
              <div className="hcp-av" style={{ background: "#6D28D9" }}>RK</div>
              <div className="hcp-bubble">Water supply issue filed — Ward 7, Block B</div>
            </div>
            <div className="hcp-msg" style={{ flexDirection: "row-reverse" }}>
              <div className="hcp-av" style={{ background: "#0891B2" }}>WD</div>
              <div className="hcp-bubble mine">Team dispatched. Est. resolution: 2 hours ✓</div>
            </div>
            <div className="hcp-msg">
              <div className="hcp-av" style={{ background: "#059669" }}>AD</div>
              <div className="hcp-bubble">Pothole on MG Road reported by Priya K.</div>
            </div>
            <div className="hcp-status"><span>●</span> 312 complaints being resolved right now</div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Hero;