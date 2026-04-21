// ─────────────────────────────────────────────
// COMPONENT: Topbar
// This is the thin dark bar fixed at the very TOP of the screen.
// It shows links to all 4 zones: Admin, Department, General, Citizen.
// ─────────────────────────────────────────────

import { Link } from "react-router-dom";

function Topbar() {
    return (
        <div className="topbar">

            {/* Logo on the left */}
            <div className="topbar-logo">
                <div className="topbar-lm">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                        <path d="M3 9l9-7 9 7v11H3z" />
                    </svg>
                </div>
                Urban Resolve
            </div>

            {/* Divider line */}
            <div className="topbar-sep" />

            {/* Zone links — "act" class highlights the current zone */}
            <Link className="topbar-link" to="/admin">Admin</Link>
            <Link className="topbar-link" to="/department">Department</Link>
            <Link className="topbar-link act" to="/general">General</Link>
            <Link className="topbar-link" to="/citizen">Citizen</Link>

            {/* Badge on the right */}
            <div className="topbar-right">
                <span className="topbar-badge">Public Zone</span>
            </div>

        </div>
    );
}

export default Topbar;