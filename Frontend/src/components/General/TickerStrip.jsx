// ─────────────────────────────────────────────
// COMPONENT: TickerStrip
// The scrolling news ticker bar below the Hero.
// Items are duplicated so the animation loops seamlessly.
// No props needed — data is hardcoded here.
// ─────────────────────────────────────────────

function TickerStrip() {
  const items = [
    "12 complaints resolved today",
    "Water supply restored in Ward 7",
    "Maintenance scheduled: 17 Mar, Ward 5–7",
    "142 new citizens registered this week",
    "Average resolution improved to 4.2 days",
  ];

  // Duplicate items so the ticker loops without a visible gap
  const allItems = [...items, ...items];

  return (
    <div className="ticker-strip">
      <div className="ticker-inner">
        {allItems.map((item, index) => (
          <span key={index} style={{ display: "inline-flex", alignItems: "center", gap: 48 }}>
            <div className="ticker-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {item}
            </div>
            <span className="ticker-sep">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default TickerStrip;