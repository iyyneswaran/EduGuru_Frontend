import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flame, Star, Zap } from 'lucide-react';

const Gamification = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const elementsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        // Reveal elements sequentially as user scrolls in
        gsap.fromTo(elementsRef.current,
            { y: 50, opacity: 0, scale: 0.9 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                stagger: 0.2,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 60%"
                }
            }
        );
    }, []);

    return (
        <section ref={sectionRef} className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">

                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Left Side: Text */}
                    <div className="lg:w-1/2" ref={(el) => { elementsRef.current[0] = el; }}>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 mb-6 font-medium text-sm">
                            <Flame size={16} /> Engagement Mechanics
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                            Learning Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-primary">Addiction</span>
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8">
                            We ripped out the boring syllabus and replaced it with dopamine architectures. Maintain streaks, climb leagues, and forge knowledge organically.
                        </p>

                        <ul className="space-y-4">
                            {[
                                { icon: <Zap size={20} className="text-yellow-400" />, text: "Multiplier rewards for consistent daily learning." },
                                { icon: <Star size={20} className="text-primary" />, text: "Unlockable tiers recognizing exceptional performance." },
                                { icon: <Flame size={20} className="text-orange-500" />, text: "Global leaderboards resetting weekly." },
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 bg-secondary/20 p-4 rounded-lg border border-border/30 backdrop-blur-sm">
                                    <div className="p-2 bg-background rounded-md shadow-sm border border-border/50">
                                        {item.icon}
                                    </div>
                                    <span className="text-foreground">{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right Side: Visuals */}
                    <div className="lg:w-1/2 relative min-h-[500px] w-full flex items-center justify-center">

                        {/* Glowing background orb for the items */}
                        <div className="absolute w-64 h-64 bg-orange-500/20 rounded-full blur-[100px]" />

                        {/* Simulated Badge 1 */}
                        <motion.div
                            ref={(el) => { elementsRef.current[1] = el; }}
                            className="absolute top-[10%] left-[10%] w-32 h-32 rounded-full border-4 border-[#334155] bg-gradient-to-br from-[#1e293b] to-[#0f172a] shadow-2xl flex items-center justify-center z-20"
                            animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        >
                            <div className="text-center">
                                <Star className="mx-auto w-10 h-10 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                                <div className="text-xs font-bold mt-2 uppercase tracking-wider text-muted-foreground">Elite</div>
                            </div>
                        </motion.div>

                        {/* Simulated Streak Card - Center */}
                        <motion.div
                            ref={(el) => { elementsRef.current[2] = el; }}
                            className="relative z-30 bg-[#0f172a]/90 backdrop-blur-xl border border-orange-500/30 p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center"
                            whileHover={{ scale: 1.05 }}
                            data-magnetic="true"
                        >
                            <Flame className="w-20 h-20 text-orange-500 fill-orange-500/20 drop-shadow-[0_0_20px_rgba(249,115,22,0.6)] mb-4" />
                            <div className="text-6xl font-black text-white tracking-tighter mb-2 shadow-black drop-shadow-md">
                                365
                            </div>
                            <div className="text-orange-400 font-bold tracking-widest uppercase text-sm">Day Streak</div>

                            {/* Progress bar */}
                            <div className="w-full h-2 bg-secondary rounded-full mt-6 overflow-hidden">
                                <div className="w-[85%] h-full bg-gradient-to-r from-orange-500 to-yellow-400 shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
                            </div>
                        </motion.div>

                        {/* Simulated Tier Hexagon */}
                        <motion.div
                            ref={(el) => { elementsRef.current[3] = el; }}
                            className="absolute bottom-[10%] right-[10%] w-36 h-36 bg-gradient-to-tr from-primary to-blue-500 rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center justify-center z-10 rotate-12"
                            animate={{ rotate: [12, -5, 12] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                        >
                            <div className="w-32 h-32 bg-[#0f172a] rounded-xl flex flex-col items-center justify-center">
                                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-primary">
                                    RANK
                                </div>
                                <div className="text-4xl text-white font-black">#1</div>
                            </div>
                        </motion.div>

                    </div>

                </div>

            </div>
        </section>
    );
};

export default Gamification;
