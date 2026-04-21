// ─────────────────────────────────────────────
// COMPONENT: GNav (Glassmorphism Navigation Bar)
// This is the main white navigation bar below the topbar.
// It receives two props:
//   - activePage : tells which nav link to highlight
//   - setPage   : function to change the current page when a link is clicked
// ─────────────────────────────────────────────

import React from "react";
import { useNavigate } from "react-router-dom";

function GNav({ activePage, setPage }) {

    const navigate = useNavigate();

    // All nav link names — we loop over these to build the links
    const navLinks = ["home", "about", "guidelines", "notices", "contact"];

    // Function to handle navigation
    const handleNavigation = (page) => {

        if (setPage) setPage(page);

        if (page === "home") {
            navigate("/general");
        } else {
            navigate(`/general/${page}`);
        }
    };

    return (
        <nav className="gnav" style={{ marginTop: 40 }}>

            {/* Brand logo — clicking it goes to Home */}
            <div
                className="gnav-logo"
                onClick={() => handleNavigation("home")}
                style={{ cursor: "pointer" }}
            >
                <div className="gnav-logo-mark">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                        <path d="M3 9l9-7 9 7v11H3z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                </div>
                <span className="gnav-brand">Urban <span>Resolve</span></span>
            </div>

            {/* Nav links — gnav-act class is added to the currently active page */}
            <div style={{ display: "flex", alignItems: "center", gap: 2, marginLeft: 12 }}>
                {navLinks.map((page) => (
                    <span
                        key={page}
                        className={`gnav-link ${activePage === page ? "gnav-act" : ""}`}
                        onClick={() => handleNavigation(page)}
                        style={{ cursor: "pointer" }}
                    >
                        {/* Capitalize first letter e.g. "home" → "Home" */}
                        {page.charAt(0).toUpperCase() + page.slice(1)}
                    </span>
                ))}
            </div>

            {/* Right side: citizen count + Login + Register buttons */}
            <div className="gnav-right">
                <span className="gnav-pill">8,421 citizens registered</span>

                <button
                    className="gnav-btn-ghost"
                    onClick={() => handleNavigation("login")}
                >
                    Login
                </button>

                <button
                    className="gnav-btn-solid"
                    onClick={() => handleNavigation("register")}
                >
                    Register Free
                </button>
            </div>

        </nav>
    );
}

export default GNav;