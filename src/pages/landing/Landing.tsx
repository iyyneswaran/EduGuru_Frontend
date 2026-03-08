import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Preloader from './Preloader';
import CursorPhysics from './CursorPhysics';
import Hero from './Hero';
import Features from './Features';
import DashboardPreview from './DashboardPreview';
import Gamification from './Gamification';
import Testimonials from './Testimonials';
import CTA from './CTA';
import Footer from './Footer';

const Landing = () => {
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className="landing-page min-h-screen text-white overflow-x-hidden" style={{ background: '#0a0e1a' }}>
            <CursorPhysics />

            {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

            <div
                className={`transition-opacity duration-1000 ${isLoading ? 'opacity-0 h-screen overflow-hidden' : 'opacity-100'}`}
            >
                <Hero />
                <Features />
                <DashboardPreview />
                <Gamification />
                <Testimonials />
                <CTA />
                <Footer />
            </div>
        </div>
    );
};

export default Landing;
