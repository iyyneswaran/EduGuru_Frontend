import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import LaserFlow from './LaserFlow';
import aiTutorImage from '@/assets/landingpage_Images/AiTutor.jpeg';

const Hero = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const headlineRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const trustRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tl = gsap.timeline({ delay: 2.6 });

        gsap.set([headlineRef.current, subtitleRef.current, ctaRef.current, trustRef.current, imageRef.current], {
            opacity: 0,
            y: 40,
        });

        tl.to(headlineRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power4.out',
        })
            .to(
                subtitleRef.current,
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
                '-=0.5'
            )
            .to(
                ctaRef.current,
                { opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.5)' },
                '-=0.4'
            )
            .to(
                trustRef.current,
                { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
                '-=0.3'
            )
            .to(
                imageRef.current,
                { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
                '-=0.4'
            );
    }, []);

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-start pt-24 pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* LaserFlow Background — positioned to cast beams over the image area */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <LaserFlow
                    color="#7a7fff"
                    wispDensity={1}
                    flowSpeed={0.35}
                    verticalSizing={2}
                    horizontalSizing={0.5}
                    fogIntensity={0.45}
                    fogScale={0.3}
                    wispSpeed={15}
                    wispIntensity={5}
                    flowStrength={0.25}
                    decay={1.1}
                    horizontalBeamOffset={0}
                    verticalBeamOffset={-0.15}
                />
            </div>

            {/* Foreground Content */}
            <div ref={containerRef} className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
                {/* Headline */}
                <h1
                    ref={headlineRef}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
                >
                    <span className="text-white">Learn Smarter with </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7a7fff] to-[#a78bfa]">
                        AI-Powered
                    </span>
                    <span className="text-white"> Tutoring </span>
                    <span className="text-2xl sm:text-3xl md:text-4xl inline-block">🚀</span>
                </h1>

                {/* Subtitle */}
                <p
                    ref={subtitleRef}
                    className="mt-2 text-lg sm:text-xl text-[#94a3b8] max-w-2xl leading-relaxed"
                >
                    Personalized AI that adapts to your learning style. Master any subject with{' '}
                    <span className="text-white font-semibold">real-time feedback</span> and intelligent guidance in <span className="text-white font-medium">English, Hinglish, & Tanglish</span>.
                </p>

                {/* CTA Button */}
                <div ref={ctaRef} className="mt-10" data-magnetic="true">
                    <motion.a
                        href="/signup"
                        className="group inline-flex items-center justify-center gap-3 bg-[#7a7fff] hover:bg-[#6b6fef] text-white px-8 py-4 rounded-full font-bold text-lg transition-colors shadow-[0_0_30px_rgba(122,127,255,0.4)]"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                        <span>Try EduGuru Free</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.a>
                </div>

                {/* Trust Badges */}
                <div ref={trustRef} className="mt-10 flex flex-col items-center gap-3">
                    <span className="text-sm text-[#64748b] tracking-wide">Trusted by learners at</span>
                    <div className="flex flex-wrap items-center justify-center gap-6 text-[#64748b]">
                        {['IIT Madras', 'Stanford', 'MIT', 'Cambridge'].map((name) => (
                            <span key={name} className="text-sm font-semibold tracking-wider uppercase opacity-60">
                                {name}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Product Screenshot / AI Tutor Image */}
                <div ref={imageRef} className="mt-14 w-full max-w-4xl mx-auto relative">
                    {/* Glow behind the image */}
                    <div className="absolute -inset-4 bg-[#7a7fff]/10 blur-3xl rounded-3xl pointer-events-none" />

                    <div className="relative rounded-2xl overflow-hidden border border-[#1e293b] shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                        {/* Mac window bar */}
                        <div className="h-9 bg-[#0c1222] border-b border-[#1e293b] flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                            <div className="flex-1 text-center text-xs text-[#475569] font-medium">
                                EduGuru — AI Tutor
                            </div>
                        </div>
                        <img
                            src={aiTutorImage}
                            alt="EduGuru AI Tutor Dashboard"
                            className="w-full h-auto block"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
