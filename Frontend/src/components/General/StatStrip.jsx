// ─────────────────────────────────────────────
// COMPONENT: StatStrip
// Shows 4 large stat numbers: citizens, complaints, resolved, avg time.
// No props needed.
// ─────────────────────────────────────────────

function StatStrip() {
  // Each stat has: number, label, trend text, and a color class
  const stats = [
    { num: "8,421", label: "Registered Citizens", trend: "▲ +142 this month", colorClass: "c1" },
    { num: "3,204", label: "Complaints Filed",    trend: "▲ +87 this week",   colorClass: "c2" },
    { num: "2,748", label: "Complaints Resolved", trend: "▲ 85.8% success rate", colorClass: "c3" },
    { num: "4.2d",  label: "Avg Resolution Time", trend: "▲ Improved 0.8d",   colorClass: "c4" },
  ];

  return (
    <div className="stat-strip">
      <div className="stat-strip-inner">
        {stats.map(({ num, label, trend, colorClass }) => (
          <div key={label} className="ss-item">
            <div className={`ss-num ${colorClass}`}>{num}</div>
            <div className="ss-lbl">{label}</div>
            <div className="ss-trend">{trend}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatStrip;