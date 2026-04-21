// ─────────────────────────────────────────────
// COMPONENT: CTABanner
// The dark gradient "Call To Action" banner near the bottom of Home.
// Props: setPage — for the Register and Login buttons
// ─────────────────────────────────────────────

import { useNavigate } from "react-router-dom";

function CTABanner() {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem("citizen_token");
    
    return (
        <div className="cta-section">
            <div className="cta-inner">
                <h2 className="cta-h">
                    Ready to make your<br /><em>city better?</em>
                </h2>
                <p className="cta-sub">
                    Join 8,400+ citizens already using Smart City Portal.
                    {isLoggedIn ? " You are already logged in and ready to file complaints." : " Create your free account and file your first complaint in under 2 minutes."}
                </p>
                <div className="cta-btns">
                    {isLoggedIn ? (
                        <button className="cta-btn-p" onClick={() => navigate("/citizen")}>
                            🚀 Go to My Dashboard
                        </button>
                    ) : (
                        <>
                            <button className="cta-btn-p" onClick={() => navigate("/citizen")}>
                                🚀 Create Free Account
                            </button>
                            <button className="cta-btn-g" onClick={() => navigate("/citizen")}>
                                Sign In
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CTABanner;