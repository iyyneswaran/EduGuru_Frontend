import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowRight } from 'lucide-react';

const CTA = () => {
    const ctaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.fromTo(ctaRef.current,
            { scale: 0.9, opacity: 0, y: 50 },
            {
                scale: 1,
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ctaRef.current,
                    start: "title 80%", // slightly earlier
                }
            }
        );
    }, []);

    return (
        <section className="py-32 px-4 sm:px-6 relative flex justify-center">

            {/* Huge background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#7a7fff]/15 blur-[150px] rounded-[100%] pointer-events-none" />

            <div
                ref={ctaRef}
                className="relative max-w-5xl w-full bg-gradient-to-br from-[#111827]/80 to-[#0a0e1a] border border-[#7a7fff]/20 rounded-3xl p-12 md:p-20 text-center overflow-hidden shadow-[0_0_50px_rgba(122,127,255,0.1)] backdrop-blur-md"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#7a7fff] to-transparent" />

                <div className="inline-flex justify-center items-center p-3 bg-[#7a7fff]/20 text-[#7a7fff] rounded-full mb-8">
                    <Sparkles className="w-8 h-8 animate-pulse" />
                </div>

                <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8">
                    Ready to Hack Your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7a7fff] to-[#06b6d4]">Learning Curve?</span>
                </h2>

                <p className="text-xl text-[#94a3b8] mb-12 max-w-2xl mx-auto">
                    Stop struggling with outdated methods. Join the elite learners leveraging AI to master any subject.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <motion.a
                        href="/signup"
                        className="group relative inline-flex items-center justify-center gap-3 bg-foreground text-background px-8 py-4 rounded-full font-bold text-lg overflow-hidden w-full sm:w-auto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        data-magnetic="true"
                    >
                        <span className="relative z-10">Create Free Account</span>
                        <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                        <div className="absolute inset-0 bg-[#7a7fff] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0" />
                        <div className="absolute inset-0 bg-[#7a7fff] opacity-0 group-hover:opacity-100 group-hover:block hidden z-0 text-white transition-opacity duration-300 pointer-events-none mix-blend-difference" />
                    </motion.a>

                    <motion.a
                        href="/login"
                        className="inline-flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground font-medium transition-colors"
                        whileHover={{ x: 5 }}
                        data-magnetic="true"
                    >
                        Sign in to existing account
                    </motion.a>
                </div>

            </div>
        </section>
    );
};

export default CTA;
