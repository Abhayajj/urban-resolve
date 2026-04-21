// ─────────────────────────────────────────────
// PAGE: Home
// This page simply IMPORTS and ARRANGES all home page components.
// Think of it as the "assembly" file — it doesn't build anything itself.
// Props: setPage — passed down to components that need navigation
// ─────────────────────────────────────────────

import Hero from "../../components/General/Hero";
import TickerStrip from "../../components/General/TickerStrip";
import StatStrip from "../../components/General/StatStrip";
import ServiceCards from "../../components/General/ServiceCards";
import ProcessSection from "../../components/General/ProcessSection";
import NoticesPreview from "../../components/General/NoticesPreview";
import Testimonials from "../../components/General/Testimonials";
import CTABanner from "../../components/General/CTABanner";
import Footer from "../../components/General/Footer";

function Home({ setPage }) {
    return (
        <div>
            <Hero setPage={setPage} />
            <TickerStrip />
            <StatStrip />
            <ServiceCards setPage={setPage} />
            <ProcessSection />
            <NoticesPreview setPage={setPage} />
            <Testimonials />
            <CTABanner setPage={setPage} />
            <Footer setPage={setPage} />
        </div>
    );
}

export default Home;