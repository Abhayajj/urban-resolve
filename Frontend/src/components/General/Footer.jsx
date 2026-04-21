// ─────────────────────────────────────────────
// COMPONENT: Footer
// The dark footer at the bottom of the Home page.
// Props: setPage — for footer navigation links
// ─────────────────────────────────────────────

function Footer({ setPage }) {
    return (
        <footer className="footer">

            {/* Top section: brand + 3 link columns */}
            <div className="footer-top">

                {/* Brand description */}
                <div>
                    <div className="footer-brand-name">
                        <div className="footer-brand-mark">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                                <path d="M3 9l9-7 9 7v11H3z" />
                            </svg>
                        </div>
                        Urban Resolve Services
                    </div>
                    <div className="footer-brand-desc">
                        A digital governance initiative by the Municipal Corporation to streamline
                        citizen complaint automation and resolution.
                    </div>
                </div>

                {/* Pages column */}
                <div>
                    <div className="footer-col-title">Pages</div>
                    {["home", "about", "guidelines", "notices", "contact"].map(p => (
                        <span key={p} className="footer-lnk" onClick={() => setPage(p)}>
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                        </span>
                    ))}
                </div>

                {/* Account column */}
                <div>
                    <div className="footer-col-title">Account</div>
                    <span className="footer-lnk" onClick={() => setPage("register")}>Register</span>
                    <span className="footer-lnk" onClick={() => setPage("login")}>Login</span>
                    <span className="footer-lnk">Privacy Policy</span>
                    <span className="footer-lnk">Terms of Service</span>
                </div>

                {/* Contact column */}
                <div>
                    <div className="footer-col-title">Contact</div>
                    <span className="footer-lnk">support@urbanresolve.gov.in</span>
                    <span className="footer-lnk">1800-XXX-XXXX (Toll Free)</span>
                    <span className="footer-lnk">Mon–Sat, 9am–6pm</span>
                    <span className="footer-lnk" onClick={() => setPage("contact")}>Send Message →</span>
                </div>

            </div>

            {/* Bottom bar: copyright + social icons */}
            <div className="footer-bottom">
                <span className="footer-copy">© 2026 Urban Resolve Municipal Corporation. All rights reserved.</span>
                <div className="footer-socials">
                    <div className="fsoc-btn" />
                    <div className="fsoc-btn" />
                    <div className="fsoc-btn" />
                </div>
            </div>
        </footer>
    );
}

export default Footer;